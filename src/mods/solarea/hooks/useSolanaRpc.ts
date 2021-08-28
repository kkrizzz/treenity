import React from 'react';
import { useCluster, useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { sleep } from '../utils/sleep';

export function useSolanaRpc(
  method: string,
  args: any[] = [],
  queryArgs?: any,
): [object | null, boolean, unknown] {
  const [connection, clusterUrl] = useCluster();

  const { data, isLoading, error } = useQuery(
    `rpccall_${method}_${clusterUrl}.${JSON.stringify(args)}`,
    () =>
      connection._rpcRequest(method, args).then((res) => {
        if ('error' in res) {
          throw new Error(res.error.message);
        }
        // return method.startsWith('eth_') ? res.result : res.result?.value;
        return queryArgs?.transform ? queryArgs?.transform(res.result) : res.result;
      }),
    queryArgs,
  );
  return [data || null, isLoading, error];
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
  return results;
}, 100);

export function useSolanaBatchedRpc(method: string, ...args): [object | null, boolean] {
  const [connection, clusterUrl] = useCluster();

  const { data, isLoading } = useQuery(
    `rpccall_${method}_${clusterUrl}.${JSON.stringify(args)}`,
    () => throttledRpcRequest(connection, method, args).then((res) => res.result?.value),
  );
  return [data || null, isLoading];
}

export function useSolanaWeb3(
  method: string,
  args: any[] = [],
  queryArgs?: any,
): [object | null, boolean] {
  const [connection, clusterUrl] = useCluster();

  const { data, isLoading } = useQuery(
    `web3call_${method}_${clusterUrl}.${JSON.stringify(args)}`,
    () => connection[method](...args),
    queryArgs,
  );
  return [data || null, isLoading];
}
