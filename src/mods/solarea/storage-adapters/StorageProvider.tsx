import React, { createContext, useContext, useMemo } from 'react';
import { useConnection } from '../hooks/useConnection';
import { useWallet } from '../utils/wallet';
import { SolanaStorageAdapter } from './SolanaStorageAdapter';
import { RestStorageAdapter } from './RestStorageAdapter';
import { clusterApiUrl, Connection } from '@solana/web3.js';

const SolanaStorageContext = createContext<SolanaStorageAdapter | null>(null);
const RestStorageContext = createContext<RestStorageAdapter | null>(null);

export function StorageProvider({ children }) {
  const connection = useMemo(() => new Connection(clusterApiUrl('devnet')), []);
  const wallet = useWallet();
  const deps = [wallet.connected, wallet.session, wallet.signed, connection];
  const provider = useMemo(() => new SolanaStorageAdapter(wallet, connection), deps);
  const restProvider = useMemo(() => new RestStorageAdapter(wallet), deps);

  return (
    <RestStorageContext.Provider value={restProvider}>
      <SolanaStorageContext.Provider value={provider} children={children} />
    </RestStorageContext.Provider>
  );
}

export function useSolanaStorage(): SolanaStorageAdapter {
  const adapter = useContext(SolanaStorageContext);
  if (!adapter) throw new Error('Solana storage adapter not present in context');

  return adapter;
}

export function useRestStorage(): RestStorageAdapter {
  const adapter = useContext(RestStorageContext);
  if (!adapter) throw new Error('Rest storage adapter not present in context');

  return adapter;
}
