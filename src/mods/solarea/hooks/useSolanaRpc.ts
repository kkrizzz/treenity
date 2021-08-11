import React from 'react';
import { useCluster, useConnection } from './useConnection';
import { useQuery } from 'react-query';

export function useSolanaRpc(method: string, ...args): [object | null, boolean] {
  const [connection, clusterUrl] = useCluster();

  const { data, isLoading } = useQuery(
    `rpccall_${method}_${clusterUrl}.${JSON.stringify(args)}`,
    () => connection._rpcRequest(method, args).then((res) => res.result?.value),
  );
  return [data || null, isLoading];
}

export function useSolanaWeb3(method: string, ...args): [object | null, boolean] {
  const [connection, clusterUrl] = useCluster();

  const { data, isLoading } = useQuery(
    `web3call_${method}_${clusterUrl}.${JSON.stringify(args)}`,
    () => connection[method](...args),
  );
  return [data || null, isLoading];
}
