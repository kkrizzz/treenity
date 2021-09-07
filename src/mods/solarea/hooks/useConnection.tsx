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
import { Cluster, Connection } from '@solana/web3.js';
import useQueryParams from './useQueryParams';
import { useSessionStorageState } from './useSessionStorageState';

type SetState<T> = Dispatch<SetStateAction<T>>;
type ContextType = [Connection, string, SetState<string>];

const VELAS_RPC_NODES = {
  mainnet: 'https://mainnet.velas.com/rpc',
  testnet: 'https://testnet.velas.com/rpc',
  devnet: 'https://devnet.velas.com/rpc',
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
  window.history.replaceState(null, '', newurl);
}

const resolveVelasClusterByUrl = (url) => {
  const targetAlias = Object.keys(VELAS_RPC_NODES).find((key) => VELAS_RPC_NODES[key] === url);
  if (targetAlias) return targetAlias;
  else return url;
};

const useCheckClusterInUrl = (urlCluster, localCluster, setCluster) => {
  useEffect(() => {
    if (!urlCluster) {
      const velasClusterAliasByUrl = resolveVelasClusterByUrl(localCluster);
      insertUrlParam('cluster', velasClusterAliasByUrl);
    }
  }, [localCluster, urlCluster]);

  useEffect(() => {
    const targetCluster = resolveVelasClusterByAlias(urlCluster);
    if (targetCluster && targetCluster !== localCluster) {
      setCluster(targetCluster);
    }
  }, [urlCluster]);
};

const ConnectionContext = createContext<ContextType>(null!);
export const ConnectionProvider = ({
  children,
  cluster = 'mainnet-beta',
}: {
  children: any;
  cluster: Cluster;
}) => {
  const { cluster: urlCluster } = useQueryParams();
  const [localCluster, setLocalCluster] = useSessionStorageState('clusterUrl', cluster as string);

  useCheckClusterInUrl(urlCluster, localCluster, setLocalCluster);

  const setCluster = (cluster) => {
    setLocalCluster(cluster);
    const velasClusterAliasByUrl = resolveVelasClusterByUrl(cluster);
    insertUrlParam('cluster', velasClusterAliasByUrl);
  };

  const currentCluster = urlCluster || localCluster || cluster;

  const value = useMemo<ContextType>(() => {
    let url;
    try {
      url = resolveVelasClusterByAlias(currentCluster as Cluster);
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
