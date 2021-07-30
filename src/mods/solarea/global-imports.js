import preact from 'preact/compat';
import bs58 from 'bs58';
import { useCluster, useConnection } from './hooks/useConnection';
import { useTransaction } from './hooks/useTransaction';
import { useBlock } from './hooks/useBlock';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useSolanaRpc, useSolanaWeb3 } from './hooks/useSolanaRpc';
import { useQuery, useInfiniteQuery } from 'react-query';
import { PublicKey } from '@solana/web3.js';

globalThis.React = preact;
globalThis.ReactDOM = preact;
globalThis.solarea = {
  bs58,
  useTransaction,
  useBlock,
  useLocalStorageState,
  useCluster,
  useConnection,
  useSolanaRpc,
  useSolanaWeb3,
  useQuery,
  useInfiniteQuery,
};

globalThis.solanaWeb3 = {
  PublicKey,
};
