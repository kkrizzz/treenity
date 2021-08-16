import * as React from 'react';
import { useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { AccountInfo, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';

export function useAccount(address: strin): [AccountInfo<Buffer> | null, boolean] {
  const connection = useConnection();
  const { data: account, isLoading } = useQuery(`acc_${address}_${connection._rpcEndpoint}`, () =>
    connection.getAccountInfo(new PublicKey(address)),
  );
  return [account || null, isLoading];
}
