import React from 'react';
import { useCluster, useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { ConfirmedBlock } from '@solana/web3.js';

export function useBlock(slot: number): [ConfirmedBlock | null, boolean] {
  const [connection, clusterUrl] = useCluster();

  const { data: block, isLoading } = useQuery(`block_${slot}_${clusterUrl}`, () =>
    connection.getConfirmedBlock(slot),
  );
  return [block || null, isLoading];
}
