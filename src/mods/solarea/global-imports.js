import preact from 'preact/compat';
import bs58 from 'bs58';
import { useTransaction } from './hooks/useTransaction';
import { useBlock } from './hooks/useBlock';

globalThis.React = preact;
globalThis.ReactDOM = preact;
globalThis.solarea = {
  bs58,
  useTransaction,
  useBlock,
};
