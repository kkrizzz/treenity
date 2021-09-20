const { connect, keyStores, WalletConnection } = solarea.near;
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

const ConnectionContext = React.createContext(null);
exports.ConnectionContext = ConnectionContext;

exports.ConnectionProvider = ({ children, config }) => {
  React.useMemo(() => {
    const connection = newConnection(config);
    return [connection, new WalletConnection(connection)];
  }, [config]);

  return <ConnectionContext.Provider value={}>{children}</ConnectionContext.Provider>;
};

exports.useConnection = () => {
  return React.useContext(ConnectionContext)[0];
};

exports.useWallet = () => {
  return React.useContext(ConnectionContext)[1];
};
