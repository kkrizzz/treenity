import React from 'react';
import { html, render } from 'htm/preact';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConnectionProvider } from './hooks/useConnection';

import config from '../../config-common';
import SolareaRoute from './SolareaRoute';
import './components/DefaultComponents';
import './markup';
import { WalletProvider } from './utils/wallet';
import WalletConnect from './components/WalletConnect';
import SolareaProgramApi from './program-api/solarea-program-api';
import { SolanaStorageProvider } from './storage-adapters/SolanaStorageProvider';

config.isClient = true;

const queryClient = new QueryClient();

export const solareaApi = new SolareaProgramApi();

const inject = (comp) => (
  <QueryClientProvider client={queryClient}>
    <ConnectionProvider cluster="devnet">
      <WalletProvider>
        <WalletConnect />
        <SolanaStorageProvider>{comp}</SolanaStorageProvider>
      </WalletProvider>
    </ConnectionProvider>
  </QueryClientProvider>
);

const App = () => {
  return inject(<SolareaRoute />);
};

render(html` <${App} />`, document.getElementById('app'));
