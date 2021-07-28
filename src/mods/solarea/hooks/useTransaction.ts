import React, { useMemo } from 'react';
import { useCluster, useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { ConfirmedTransaction } from '@solana/web3.js';

export function useTransaction(signature: string): [ConfirmedTransaction | null, boolean] {
  const [connection, clusterUrl] = useCluster();

  const { data: transaction, isLoading } = useQuery(`transaction_${signature}_${clusterUrl}`, () =>
    connection.getConfirmedTransaction(signature),
  );

  useMemo(() => {
    if (!isLoading && transaction) {
      transaction.transaction.message = transaction.transaction.compileMessage();
    }
  }, [transaction, isLoading]);

  return [transaction || null, isLoading];
}
