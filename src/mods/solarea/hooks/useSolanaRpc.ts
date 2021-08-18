import React from 'react';
import { useCluster, useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { sleep } from '../utils/sleep';

export function useSolanaRpc(method: string, ...args): [object | null, boolean] {
  const [connection, clusterUrl] = useCluster();

  const { data, isLoading } = useQuery(
    `rpccall_${method}_${clusterUrl}.${JSON.stringify(args)}`,
    () => connection._rpcRequest(method, args).then((res) => res.result?.value || res.result),
  );
  return [data || null, isLoading];
}

function throttleArray(func, ms) {
  let currentCachesPromise: Promise<any> | null = null;
  let currentRequests: any[] = [];

  return async function throttledFunc(...args): Promise<any> {
    // if not yet waiting - create new waiting promise
    let prom = currentCachesPromise;
    if (!prom) {
      const runFunc = () => {
        const requests = currentRequests;
        currentRequests = [];
        currentCachesPromise = null;
        return func(requests);
      };
      // wait 50ms to collect more accounts
      prom = currentCachesPromise = sleep(ms).then(runFunc);
    }

    const idx = currentRequests.length;
    // add account to current wait promise
    currentRequests.push(args);
    const results = await prom;
    return results[idx];
  };
}

const throttledRpcRequest = throttleArray(async (requests) => {
  const connection = requests[0][0];
  const rpcReqs = requests.map(([, methodName, args]) => ({ methodName, args }));
  const results = await connection._rpcBatchRequest(rpcReqs);
  return results.data;
}, 100);

export function useSolanaBatchedRpc(method: string, ...args): [object | null, boolean] {
  const [connection, clusterUrl] = useCluster();

  const { data, isLoading } = useQuery(
    `rpccall_${method}_${clusterUrl}.${JSON.stringify(args)}`,
    () => throttledRpcRequest(connection, method, args).then((res) => res.result?.value),
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
