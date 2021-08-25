// @ts-ignore
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Cluster, clusterApiUrl, Connection } from '@solana/web3.js';
import { useLocalStorageState } from './useLocalStorageState';
import useLocation from './useLocation';
import useQueryParams from './useQueryParams';

type SetState<T> = Dispatch<SetStateAction<T>>;
type ContextType = [Connection, string, SetState<string>];

const VELAS_RPC_NODES = {
  devnet: 'https://devnet.velas.com/rpc',
  testnet: 'https://testnet.velas.com/rpc',
  mainnet: 'https://mainnet.velas.com/rpc',
};

const resolveVelasClusterByAlias = (cluster) => {
  if (Object.keys(VELAS_RPC_NODES).includes(cluster)) return VELAS_RPC_NODES[cluster];
  else if (!cluster) return VELAS_RPC_NODES['mainnet'];
  else return cluster;
};
function insertUrlParam(key, value) {
  let searchParams = new URLSearchParams(window.location.search);
  searchParams.set(key, value);
  let newurl = '?' + searchParams.toString();
  window.history.pushState(null, '', newurl);
}

const resolveVelasClusterByUrl = (url) => {
  const targetAlias = Object.keys(VELAS_RPC_NODES).find((key) => VELAS_RPC_NODES[key] === url);
  if (targetAlias) return targetAlias;
  else return url;
};

const useCheckClusterInUrl = (localCluster, setCluster) => {
  const { cluster } = useQueryParams();
  useEffect(() => {
    const velasClusterAliasByUrl = resolveVelasClusterByUrl(localCluster);
    const clusterAliasByUrl = resolveVelasClusterByUrl(cluster);
    if (velasClusterAliasByUrl !== clusterAliasByUrl) {
      insertUrlParam('cluster', velasClusterAliasByUrl);
    }
  }, [localCluster]);

  useEffect(() => {
    const targetCluster = resolveVelasClusterByAlias(cluster);

    if (targetCluster && targetCluster !== localCluster) {
      setCluster(targetCluster);
    }
  }, [cluster]);
};

const ConnectionContext = createContext<ContextType>(null!);
export const ConnectionProvider = ({
  children,
  cluster = 'mainnet-beta',
}: {
  children: any;
  cluster: Cluster;
}) => {
  const [currentCluster, setCluster] = useLocalStorageState('clusterUrl', cluster as string);

  useCheckClusterInUrl(currentCluster, setCluster);

  const value = useMemo<ContextType>(() => {
    let url;
    try {
      url = clusterApiUrl(currentCluster as Cluster);
    } catch (err) {
      url = currentCluster;
    }
    return [new Connection(url), currentCluster, setCluster];
  }, [currentCluster]);

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};

export function useConnection() {
  return useContext(ConnectionContext)[0];
}

export function useCluster() {
  return useContext(ConnectionContext);
}
