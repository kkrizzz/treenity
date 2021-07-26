import React from 'react';
import { useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { ConfirmedBlock } from '@solana/web3.js';

export function useBlock(slot: number): [ConfirmedBlock | null, boolean] {
  const connection = useConnection();

  const { data: block, isLoading } = useQuery(`block_${slot}`, () =>
    connection.getConfirmedBlock(slot),
  );
  return [block || null, isLoading];
}
