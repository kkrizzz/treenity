// @ts-ignore
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Cluster, clusterApiUrl, Connection } from '@solana/web3.js';

type SetState<T> = Dispatch<SetStateAction<T>>;
type ContextType = [Connection, string, SetState<string>];

const ConnectionContext = createContext<ContextType>(null!);
export const ConnectionProvider = ({
  children,
  cluster = 'mainnet-beta',
}: {
  children: any;
  cluster: Cluster;
}) => {
  const [currentCluster, setCluster] = useState(cluster as string);

  const value = useMemo<ContextType>(() => {
    let url;
    try {
      url = clusterApiUrl(cluster);
    } catch (err) {
      url = cluster;
    }
    return [new Connection(url), currentCluster, setCluster];
  }, [currentCluster]);

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};

export function useConnection() {
  return useContext(ConnectionContext)[0];
}

export function useCluster() {
  const [conn, currentCluster, setCluster] = useContext(ConnectionContext);
  return [currentCluster, setCluster];
}
