import React from 'react';
import { useCluster, useConnection } from './useConnection';
import { useQuery } from 'react-query';

export function useSolanaRpc(method: string, ...args): [object | null, boolean] {
  const [connection, clusterUrl] = useCluster();

  const { data, isLoading } = useQuery(
    `rpccall_${method}_${clusterUrl}.${JSON.stringify(args)}`,
    () => connection[method](...args),
  );
  return [data || null, isLoading];
}
