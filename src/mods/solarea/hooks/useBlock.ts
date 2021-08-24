import React from 'react';
import { useCluster, useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { ConfirmedBlock } from '@solana/web3.js';
import { useSolanaRpc } from './useSolanaRpc';

export function useBlock(slot: number): [ConfirmedBlock | null, boolean] {
  return useSolanaRpc('getConfirmedBlock', [slot, 'jsonParsed']) as [ConfirmedBlock | null, boolean];
}
