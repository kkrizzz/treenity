import * as React from 'react';
import { useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { AccountInfo, PublicKey } from '@solana/web3.js';

export function useAccount(address: string): [AccountInfo<Buffer> | null, boolean] {
  const connection = useConnection();
  const { data: account, isLoading } = useQuery(`acc_${address}_${connection._rpcEndpoint}`, () =>
    connection.getAccountInfo(new PublicKey(address)),
  );
  return [account || null, isLoading];
}
