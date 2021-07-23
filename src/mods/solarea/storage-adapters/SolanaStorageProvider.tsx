import React, { createContext, useContext, useMemo } from 'react';
import { useConnection } from '../hooks/useConnection';
import { useWallet } from '../utils/wallet';
import { SolanaStorageAdapter } from './SolanaStorageAdapter';
import { RestStorageAdapter } from './RestStorageAdapter';

const SolanaStorageContext = createContext<SolanaStorageAdapter | null>(null);
const RestStorageContext = createContext<RestStorageAdapter | null>(null);

export function SolanaStorageProvider({ children }) {
  const connection = useConnection();
  const wallet = useWallet();
  const provider = useMemo(() => new SolanaStorageAdapter(wallet, connection), [
    wallet,
    connection,
  ]);
  const restProvider = useMemo(() => new RestStorageAdapter(wallet), [wallet.session]);

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
