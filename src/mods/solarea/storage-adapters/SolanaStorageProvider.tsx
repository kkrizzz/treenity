import { Connection, sendAndConfirmRawTransaction, Transaction } from '@solana/web3.js';
import { useConnection } from '../hooks/useConnection';
import { useWallet, WalletAdapterInterface } from '../utils/wallet';
import { useMemo } from 'react';
import { toast } from '../utils/toast';
import { createViewAddress } from '../program-api/solarea-program-api';
import { solareaApi } from '../client';
import { promiseSequence } from '../../../utils/promise-sequence';
import { SolareaViewId } from './SolareaViewId';

class SolanaStorageProvider {
  adapter: WalletAdapterInterface;
  connection: Connection;

  validateWallet() {
    if (!this.adapter.wallet || !this.adapter.connected) {
      this.adapter.select();
      return toast('Please connect wallet');
    }
  }

  constructor(adapter: WalletAdapterInterface, connection: Connection) {
    this.adapter = adapter;
    this.connection = connection;
  }

  async save(id: SolareaViewId, dataType: number, buffer: string): Promise<void> {
    this.validateWallet();

    const { address, context, name } = id;

    const [viewAddress] = createViewAddress(address, context, name);
    const account = await this.connection.getAccountInfo(viewAddress);
    const isUpdate = !!account;
    const data = Buffer.from(buffer);
    const [txs, storageAddress] = solareaApi.createTransactions(
      this.adapter.wallet.publicKey,
      address,
      context,
      name,
      data,
      dataType,
      isUpdate,
    );
    const { blockhash } = await this.connection.getRecentBlockhash('finalized');
    txs.forEach((i) => {
      i.recentBlockhash = blockhash;
      i.feePayer = this.adapter.wallet.publicKey;
    });
    const sendTransaction = (t: Transaction) =>
      sendAndConfirmRawTransaction(this.connection, t.serialize(), {
        skipPreflight: true,
        commitment: 'finalized',
      });
    const transactions = await this.adapter.wallet.signAllTransactions(txs);
    await promiseSequence(transactions.slice(0, 2).map((t) => () => sendTransaction(t)));
    await Promise.allSettled(transactions.slice(2).map(sendTransaction));
    toast('Code was saved to blockchain!');
    console.log('storageAddress - ', storageAddress);
  }
}

export default function useSolanaStorage() {
  const connection = useConnection();
  const wallet = useWallet();

  return useMemo(() => new SolanaStorageProvider(wallet, connection), []);
}
