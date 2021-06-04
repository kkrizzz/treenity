// @ts-ignore
import React, { createContext, useContext, useMemo } from 'react';
import { Cluster, clusterApiUrl, Connection } from '@solana/web3.js';

const ConnectionContext = createContext<Connection>(null);
export const ConnectionProvider = ({
  children,
  cluster = 'mainnet-beta',
}: {
  children: any;
  cluster: Cluster;
}) => {
  const connection = useMemo(() => {
    const url = clusterApiUrl(cluster);
    return new Connection(url);
  }, [cluster]);

  return <ConnectionContext.Provider value={connection}>{children}</ConnectionContext.Provider>;
};

export function useConnection() {
  return useContext(ConnectionContext);
}
