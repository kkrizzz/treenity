import * as preact from 'preact/compat';
import bs58 from 'bs58';

globalThis.React = preact;
globalThis.ReactDOM = preact;
globalThis.solarea = {
  bs58,
};
