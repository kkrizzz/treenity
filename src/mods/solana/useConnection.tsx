// @ts-ignore
import React, { createContext, useContext, useMemo } from 'react';
import { Connection } from '@solana/web3.js';

const ConnectionContext = createContext<Connection>(null);
export const ConnectionProvider = ({ children }) => {

  const connection = useMemo(() => new Connection('https://api.mainnet-beta.solana.com'), []);
  return <ConnectionContext.Provider value={connection}>
    {children}
  </ConnectionContext.Provider>;
};

export function useConnection() {
  return useContext(ConnectionContext);
}
