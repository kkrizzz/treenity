import preact from 'preact/compat';
import bs58 from 'bs58';
import { parseRlp } from './evm/parse-rlp';
import { useCluster, useConnection } from './hooks/useConnection';
import { useGraphQL } from './hooks/useGraphQL';
import { useTransaction } from './hooks/useTransaction';
import { useBlock } from './hooks/useBlock';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useSolanaRpc, useSolanaWeb3 } from './hooks/useSolanaRpc';
import { useQuery, useInfiniteQuery } from 'react-query';
import { PublicKey } from '@solana/web3.js';
import * as Layout from '@solana/web3.js/src/layout';
import { useWeb3Rpc } from './hooks/useWeb3Rpc';
import * as BufferLayout from '@solana/buffer-layout';
import { publicKey, publicKeyString } from './utils/public-key-layout';
import { Buffer } from 'buffer';

const SolanaLayout = {
  ...Layout,
  publicKey,
  publicKeyString,
};

globalThis.React = preact;
globalThis.ReactDOM = preact;
globalThis.solarea = {
  bs58,
  Buffer,
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
  useGraphQL,
  BufferLayout,
  SolanaLayout,
  parseRlp,
};

globalThis.solanaWeb3 = {
  PublicKey,
};
