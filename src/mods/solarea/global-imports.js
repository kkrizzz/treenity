import preact from 'preact/compat';
import bs58 from 'bs58';
import { parseRlp } from './evm/parse-rlp';
import { useCluster, useConnection } from './hooks/useConnection';
import { useTransaction } from './hooks/useTransaction';
import { useBlock } from './hooks/useBlock';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useSolanaRpc, useSolanaWeb3 } from './hooks/useSolanaRpc';
import { useQuery, useInfiniteQuery } from 'react-query';
import { PublicKey } from '@solana/web3.js';
import { useWeb3Rpc } from './hooks/useWeb3Rpc';
import BufferLayout from '@solana/buffer-layout';

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
  useWeb3Rpc,
  BufferLayout,
  parseRlp,
};

globalThis.solanaWeb3 = {
  PublicKey,
};
