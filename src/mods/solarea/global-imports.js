// import { PublicKey } from '@solana/web3.js';
// import * as Layout from '@solana/web3.js/src/layout';
// import bn from 'bn.js';
// import bs58 from 'bs58';
import { Buffer } from 'buffer';
import preact from 'preact/compat';
import { useQuery, useInfiniteQuery } from 'react-query';
import styled, { ThemeProvider } from 'styled-components';
import zustand from 'zustand';

// import { parseRlp } from './evm/parse-rlp';
// import { useConnection, ConnectionProvider } from './hooks/useConnection';
import useDocumentTitle from './hooks/useDocumentTitle';
import { useGraphQL, fetchGraphQL } from './hooks/useGraphQL';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import useParams from './hooks/useParams';
import useQueryParams from './hooks/useQueryParams';
// import { publicKey, publicKeyString } from './utils/public-key-layout';
// import { ethToVlx, vlxToEth } from './utils/vlx-address-lib';

// const borsh = require('borsh');

// const SolanaLayout = {
//   ...Layout,
//   publicKey,
//   publicKeyString,
// };

globalThis.React = preact;
globalThis.ReactDOM = preact;
globalThis.styled = styled;
globalThis.solarea = {
  // ConnectionProvider,
  // nearContext,
  // bs58,
  // bn,
  // borsh,
  // vlxToEth,
  // ethToVlx,
  Buffer,
  // useTransaction,
  // useBlock,
  useQueryParams,
  useLocalStorageState,
  // useCluster,
  useParams,
  // useConnection,
  // useSolanaRpc,
  // useSolanaBatchedRpc,
  // useSolanaWeb3,
  useQuery,
  useInfiniteQuery,
  useGraphQL,
  // useMetaplexNFT,
  useDocumentTitle,
  fetchGraphQL,
  // BufferLayout,
  // SolanaLayout,
  // parseRlp,
  zustand,
  ThemeProvider,
};

// globalThis.solanaWeb3 = {
//   PublicKey,
// };
