import preact from 'preact/compat';
import bs58 from 'bs58';
import { useCluster, useConnection } from './hooks/useConnection';
import { useTransaction } from './hooks/useTransaction';
import { useBlock } from './hooks/useBlock';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useSolanaRpc } from './hooks/useSolanaRpc';

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
};
