import React from 'react';

import { connect, keyStores, WalletConnection, Near } from 'near-api-js';
const keyStore = new keyStores.BrowserLocalStorageKeyStore();

const NEAR_CONNECTION_CONFIG = {
  mainnet: {
    keyStore,
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
  },
  testnet: {
    keyStore,
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
  },
};

async function newConnection(config) {
  return await connect(NEAR_CONNECTION_CONFIG[config]);
}

export const ConnectionContext = React.createContext<[Near | undefined, WalletConnection]>(null!);

export const ConnectionProvider = ({ children, config }: { children: any; config: string }) => {
  const [status, setStatus] = React.useState<'ready' | 'error' | 'load'>('load');
  const [connection, setConnection] = React.useState<Near | undefined>(undefined);

  React.useEffect(() => {
    (async function () {
      try {
        const connection = await newConnection(config);
        setConnection(connection);
        setStatus('ready');
      } catch (e) {
        setStatus('error');
      }
    })();
  }, []);

  const wallet = React.useMemo(() => {
    if (status == 'ready') return new WalletConnection(connection, 'app');
    return undefined;
  }, [connection, status]);

  if (status == 'load') return <div>Connecting to near api ...</div>;
  if (status == 'error') return <div>Failed to connect</div>;

  return (
    <ConnectionContext.Provider value={[connection, wallet]}>{children}</ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  return React.useContext(ConnectionContext)[0];
};

export const useWallet = () => {
  return React.useContext(ConnectionContext)[1];
};
