import * as React from 'react';
import { useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { AccountInfo, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';

export function useAccount(
  address: string,
  cluster: 'mainnet-beta' | 'devnet' = 'mainnet-beta',
): [AccountInfo<Buffer> | null, boolean] {
  const connection = useConnection();
  const { data: account, isLoading } = useQuery(`acc_${address}`, () =>
    connection.getAccountInfo(new PublicKey(address)),
  );
  return [account || null, isLoading];
}
