import * as React from 'react';
import { useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { clusterApiUrl, ConfirmedSignatureInfo, Connection, PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';

export function useAccountTransactions(
  address: string,
  cluster: 'mainnet-beta' | 'devnet' = 'mainnet-beta',
  limit: number = 10,
): [Array<ConfirmedSignatureInfo> | null, boolean] {
  const connection = useMemo(() => {
    const url = clusterApiUrl(cluster);
    return new Connection(url);
  }, [cluster]);

  const { data: transaction, isLoading } = useQuery(`acc_txs_${address}`, () =>
    connection.getConfirmedSignaturesForAddress2(new PublicKey(address), { limit }),
  );
  return [transaction || null, isLoading];
}
