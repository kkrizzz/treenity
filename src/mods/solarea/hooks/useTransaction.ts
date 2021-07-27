import React from 'react';
import { useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { ConfirmedTransaction } from '@solana/web3.js';

export function useTransaction(signature: string): [ConfirmedTransaction | null, boolean] {
  const connection = useConnection();

  const { data: transaction, isLoading } = useQuery(`transaction_${signature}`, () =>
    connection.getConfirmedTransaction(signature),
  );

  if (!isLoading) {
    transaction.transaction.message = transaction.transaction.compileMessage();
  }

  return [transaction || null, isLoading];
}
