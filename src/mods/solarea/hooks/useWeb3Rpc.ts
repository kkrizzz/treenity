import React from 'react';
import { useCluster, useConnection } from './useConnection';
import { useQuery } from 'react-query';

export function useWeb3Rpc(method: string, ...args): [object | null, boolean] {
  const { data, isLoading } = useQuery(`rpccall_web3_${method}.${JSON.stringify(args)}`, () =>
    globalThis
      .fetch('https://api.velas.com/', {
        method: 'POST',
        body: JSON.stringify({
          id: 4,
          jsonrpc: '2.0',
          method: method,
          params: [...args],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json()),
  );
  return [data || null, isLoading];
}
