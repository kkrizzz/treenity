import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  WalletAdapter,
  LedgerWalletAdapter,
  SolongWalletAdapter,
  PhantomWalletAdapter,
  SolletExtensionAdapter,
  MathWalletAdapter,
} from '../wallet-adapters';
import './wallet.css';
import { toast } from './toast';
import { WALLETS_ERROR_TOAST_COLOR } from '../theme/colors';
import { Modal } from '../components/Modal';
import { req } from './req';
import { VALIDATE_SERVICE_URL, SESSION_SERVICE_URL } from '../config';
import { useSessionStorageState } from '../hooks/useSessionStorageState';
import { AccountMeta, Transaction, TransactionInstruction } from '@solana/web3.js';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const ASSET_URL = 'https://cdn.jsdelivr.net/gh/solana-labs/oyster@main/assets/wallets';

export const WALLET_PROVIDERS = [
  {
    name: 'Sollet Extension',
    url: 'https://www.sollet.io/extension',
    icon: `${ASSET_URL}/sollet.svg`,
    adapter: SolletExtensionAdapter as any,
  },
  {
    name: 'Ledger',
    url: 'https://www.ledger.com',
    icon: `${ASSET_URL}/ledger.svg`,
    adapter: LedgerWalletAdapter,
  },
  {
    name: 'Solong',
    url: 'https://www.solong.com',
    icon: `${ASSET_URL}/solong.png`,
    adapter: SolongWalletAdapter,
  },
  {
    name: 'Phantom',
    url: 'https://www.phantom.app',
    icon: `https://www.phantom.app/img/logo.png`,
    adapter: PhantomWalletAdapter,
  },
  {
    name: 'MathWallet',
    url: 'https://www.mathwallet.org',
    icon: `${ASSET_URL}/mathwallet.svg`,
    adapter: MathWalletAdapter,
  },
];

export interface WalletAdapterInterface {
  authorizeWithTx: any;
  signed: boolean;
  states: any;
  transaction: Transaction | undefined;
  session: string;
  wallet: any;
  connected: boolean;
  select: any;
  close: any;
}

const WalletContext = React.createContext<WalletAdapterInterface | null>(null);

export function WalletProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState<WalletAdapter | undefined>(undefined);
  const [autoConnect, setAutoConnect] = useLocalStorageState('autoconnect', false);
  const [autoConnectProvider, setAutoConnectProvider] = useLocalStorageState(
    'autoconnect-provider',
    '',
  );
  const [session, setSession] = useSessionStorageState('sessionid');
  const [signed, setSigned] = useSessionStorageState('signed');
  const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);

  useEffect(() => {
    const connectWallet = () => {
      if (!autoConnect) setAutoConnectProvider('');
      if (autoConnect && autoConnectProvider) {
        const targetWallet = WALLET_PROVIDERS.find((i) => i.name === autoConnectProvider);
        if (!targetWallet) return;

        const wal = new targetWallet.adapter();
        wal.connect();
        setWallet(wal);
      }
    };

    if (document.readyState !== 'complete') {
      // wait to ensure that browser extensions are loaded
      const listener = () => {
        connectWallet();
        window.removeEventListener('load', listener);
      };
      window.addEventListener('load', listener);
      return () => window.removeEventListener('load', listener);
    } else {
      connectWallet();
    }
  }, [autoConnect, autoConnectProvider]);

  useEffect(() => {
    if (wallet) {
      wallet.on('connect', () => {
        if (wallet?.publicKey) {
          if (session) {
            setConnected(true);
          }
          if (!session) {
            req.post(SESSION_SERVICE_URL, { pubkey: wallet.publicKey.toBase58() }).then((res) => {
              res.text().then((sid) => {
                setConnected(true);
                setSession(sid);
                // toast('Connected', 5000, WALLETS_ERROR_TOAST_COLOR);
                close();
              });
            });
          }
          toast('Wallet connected');
        }
      });

      wallet.on('disconnect', () => {
        setSession('');
        setSigned('');
        setConnected(false);
        setWallet(undefined);
        setTransaction(undefined);
        toast('Disconnected', 5000, WALLETS_ERROR_TOAST_COLOR);
      });
    }

    return () => {
      setConnected(false);
      if (wallet && wallet.connected) {
        wallet.disconnect();
        setConnected(false);
      }
    };
  }, [wallet]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const select = useCallback(() => setIsModalVisible(true), []);
  const close = useCallback(() => setIsModalVisible(false), []);

  const authorizeWithTx = async () => {
    if (!wallet || !connected || signed) throw new Error('');

    const keys: Array<AccountMeta> = [
      { isSigner: true, isWritable: false, pubkey: wallet.publicKey },
    ];

    const txi = new TransactionInstruction({
      keys: keys,
      programId: wallet.publicKey.toBase58(),
      data: Buffer.from(session),
    });

    const tx = new Transaction({
      recentBlockhash: '5Tx8F3jgSHx21CbtjwmdaKPLM5tWmreWAnPrbqHomSJF',
      feePayer: keys[0].pubkey,
    });

    tx.add(txi);
    await wallet.signTransaction(tx);

    await req.post(VALIDATE_SERVICE_URL, {
      transaction: tx.serialize(),
    });

    setSigned(true);
  };

  return (
    <WalletContext.Provider
      value={{
        signed,
        states: {
          autoConnect,
          setAutoConnect,
          autoConnectProvider,
          setAutoConnectProvider,
        },
        authorizeWithTx,
        transaction,
        wallet,
        connected,
        select,
        close,
        session,
      }}
    >
      {children}
      <Modal
        closeBtnColor={'white'}
        modalBackground={'#2d2d2d'}
        width={400}
        transparent={false}
        onBackdropPress={close}
        isVisible={isModalVisible}
      >
        {WALLET_PROVIDERS.map((provider) => {
          const onClick = () => {
            const adapterWallet = new provider.adapter();

            if (autoConnect) setAutoConnectProvider(provider.name);
            else setAutoConnectProvider('');

            adapterWallet.connect();
            setWallet(adapterWallet);
            setSession('');
          };
          return (
            <div className="wallet-select_item" onClick={onClick}>
              <img
                style={{ background: 'rgba(255,255,255,0)' }}
                width={50}
                height={50}
                src={provider.icon}
              />
              <div className="wallet-select_item-title">{provider.name}</div>
            </div>
          );
        })}
      </Modal>
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('Missing wallet context');
  }

  const wallet = context.wallet;
  return {
    ...context,
    wallet,
    connect() {
      wallet ? wallet.connect() : context.select();
    },
    disconnect() {
      wallet?.disconnect();
    },
  };
}
