import preact from 'preact/compat';
import bs58 from 'bs58';
import zustand from 'zustand';
import bn from 'bn.js';

import { parseRlp } from './evm/parse-rlp';
import { useCluster, useConnection } from './hooks/useConnection';
import useDocumentTitle from './hooks/useDocumentTitle';
import { useGraphQL, fetchGraphQL } from './hooks/useGraphQL';
import useParams from './hooks/useParams';
import { useTransaction } from './hooks/useTransaction';
import { useBlock } from './hooks/useBlock';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useSolanaRpc, useSolanaWeb3, useSolanaBatchedRpc } from './hooks/useSolanaRpc';
import { useQuery, useInfiniteQuery } from 'react-query';
import { PublicKey } from '@solana/web3.js';
import * as Layout from '@solana/web3.js/src/layout';
import * as BufferLayout from '@solana/buffer-layout';
import { publicKey, publicKeyString } from './utils/public-key-layout';
import { Buffer } from 'buffer';
import { ethToVlx, vlxToEth } from './utils/vlx-address-lib';
import { useMetaplexNFT } from './hooks/useMetaplexNFT';
import styled, { ThemeProvider } from 'styled-components';
import * as nearContext from './hooks/near/useConnection';
import { ConnectionProvider } from './hooks/useConnection';
import useQueryParams from './hooks/useQueryParams';

const borsh = require('borsh');

const SolanaLayout = {
  ...Layout,
  publicKey,
  publicKeyString,
};

globalThis.React = preact;
globalThis.ReactDOM = preact;
globalThis.styled = styled;
globalThis.solarea = {
  ConnectionProvider,
  nearContext,
  bs58,
  bn,
  borsh,
  vlxToEth,
  ethToVlx,
  Buffer,
  useTransaction,
  useBlock,
  useQueryParams,
  useLocalStorageState,
  useCluster,
  useParams,
  useConnection,
  useSolanaRpc,
  useSolanaBatchedRpc,
  useSolanaWeb3,
  useQuery,
  useInfiniteQuery,
  useGraphQL,
  useMetaplexNFT,
  useDocumentTitle,
  fetchGraphQL,
  BufferLayout,
  SolanaLayout,
  parseRlp,
  zustand,
  ThemeProvider,
};

globalThis.solanaWeb3 = {
  PublicKey,
};
