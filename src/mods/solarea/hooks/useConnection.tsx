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
import { useLocalStorageState } from './useLocalStorageState';

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
  const [currentCluster, setCluster] = useLocalStorageState('clusterUrl', cluster as string);

  const value = useMemo<ContextType>(() => {
    let url;
    try {
      url = clusterApiUrl(currentCluster as Cluster);
    } catch (err) {
      url = currentCluster;
    }
    return [new Connection(url, {}), currentCluster, setCluster];
  }, [currentCluster]);

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};

export function useConnection() {
  return useContext(ConnectionContext)[0];
}

export function useCluster() {
  return useContext(ConnectionContext);
}
