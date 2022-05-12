import React, { useMemo } from 'react';
import { apis } from '../apis';

import { RestStorageAdapter, SolRestStorageAdapter } from './RestStorageAdapter';

export function StorageProvider({ children }) {
  // const connection = useMemo(() => new Connection(clusterApiUrl('devnet')), []);
  // const wallet = useWallet();
  // const deps = [wallet.connected, wallet.session, wallet.signed, connection];
  // const solanaProvider = useMemo(() => new SolanaStorageAdapter(wallet, connection), deps);
  useMemo(() => {
    const baseUrl = '/solarea/api';
    apis.dev = new RestStorageAdapter(baseUrl);
    apis.sol = new SolRestStorageAdapter(baseUrl);
  }, []);

  return children; // (
  // <RestStorageContext.Provider value={restProvider}>
  // {children}
  // {/*<SolanaStorageContext1 value={solanaProvider} children={children} />*/}
  // </RestStorageContext.Provider>
  // );
}
