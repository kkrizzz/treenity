import { Connection, PublicKey, sendAndConfirmRawTransaction, Transaction } from '@solana/web3.js';
import memoize from 'lodash/memoize';
import { WalletAdapterInterface } from '../utils/wallet';
import { SolareaViewId } from './SolareaViewId';
import { solareaApi } from '../client';
import { promiseSequence } from '../../../utils/promise-sequence';
import {
  IGetStorageOptions,
  IStorageAdapter,
  SolareaLinkData,
  SolareaViewData,
} from './IStorageAdapter';
import { getMultipleAccounts } from '../utils/get-multiple-accounts';
import { sleep } from '../utils/sleep';
import { mimeTypesData } from '../utils/mime-types-data';

const sendTransaction = (connection: Connection, t: Transaction) =>
  sendAndConfirmRawTransaction(connection, t.serialize(), {
    skipPreflight: true,
    commitment: 'finalized',
  });

let currentAddrs: PublicKey[] = [];
let currentCachesPromise: Promise<any> | null = null;

/**
 * Collect accounts loading for some time, and then load all at once
 */
const loadSolanaAccount = memoize(
  async (connection: Connection, address: PublicKey) => {
    // if not yet waiting - create new waiting promise
    let prom = currentCachesPromise;
    if (!prom) {
      const loadAllAccounts = () => {
        const addrs = currentAddrs;
        currentAddrs = [];
        currentCachesPromise = null;
        return getMultipleAccounts(connection, addrs, 'recent');
      };
      // wait 50ms to collect more accounts
      prom = currentCachesPromise = sleep(50).then(loadAllAccounts);
    }

    const loadAccount = async () => {
      const idx = currentAddrs.length;
      // add account to current wait promise
      currentAddrs.push(address);
      const accounts = await prom;
      const value = accounts.value[idx];
      return value && new Buffer(value.data[0], 'base64');
    };

    return loadAccount();
  },
  (conn, pubkey) => pubkey.toBase58(),
);

export class SolanaStorageAdapter implements IStorageAdapter {
  constructor(private walletConnection: WalletAdapterInterface, private connection: Connection) {}

  validateWallet() {
    if (!this.walletConnection.wallet || !this.walletConnection.connected) {
      this.walletConnection.select();
      return false;
    }
    return true;
  }

  async _loadViewData(id: SolareaViewId): Promise<SolareaViewData> {
    const [storageAddress] = id.storageAddress;

    const accountData = await loadSolanaAccount(this.connection, storageAddress);
    if (!accountData) throw new Error('not_found');

    const { owner, data, type } = solareaApi.unpackData(accountData);

    if (type === mimeTypesData['solarea/link']) {
      return new SolareaLinkData(id, SolareaViewId.fromString(data.toString('utf-8')), [owner]);
    }

    const viewData = new SolareaViewData(id, type, data, [owner]);
    viewData.dataSource = 'solana';
    return viewData;
  }

  async get(id: SolareaViewId, opts?: IGetStorageOptions): Promise<SolareaViewData> {
    let viewData = await this._loadViewData(id);

    if (opts?.resolveLinks) {
      while (viewData.type === mimeTypesData['solarea/link']) {
        viewData = await this._loadViewData((viewData as SolareaLinkData).linkTo);
      }
    }

    return viewData;
  }

  async save(data: SolareaViewData): Promise<void> {
    if (!this.validateWallet()) return;

    const { address, context, name } = data.id;

    const [storageAddress] = data.id.storageAddress;
    const account = await this.connection.getAccountInfo(storageAddress);
    const isUpdate = !!account;
    const [txs, _storageAddress] = solareaApi.createTransactions(
      this.walletConnection.wallet.publicKey,
      address,
      context,
      name,
      data.data,
      data.type,
      isUpdate,
    );
    const { blockhash } = await this.connection.getRecentBlockhash('finalized');
    txs.forEach((i) => {
      i.recentBlockhash = blockhash;
      i.feePayer = this.walletConnection.wallet.publicKey;
    });

    const transactions = await this.walletConnection.wallet.signAllTransactions(txs);
    // send first two transactions in sequence
    await promiseSequence(
      transactions.slice(0, 2).map((t) => () => sendTransaction(this.connection, t)),
    );
    // send all other transactions
    await Promise.allSettled(transactions.slice(2).map((t) => sendTransaction(this.connection, t)));
    console.log('storageAddress - ', storageAddress);
  }

  async remove(id: SolareaViewId): Promise<void> {
    const walletPub = this.walletConnection.wallet.publicKey;
    const [storageAddress] = id.storageAddress;

    const transaction = new Transaction().add(
      solareaApi.removeInstruction(walletPub, storageAddress),
    );
    const { blockhash } = await this.connection.getRecentBlockhash('finalized');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletPub;

    const signed = await this.walletConnection.wallet.signTransaction(transaction);
    await sendTransaction(this.connection, signed);
  }
}
