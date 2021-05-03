import React from 'react';
import { html, render } from 'htm/preact';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConnectionProvider } from './hooks/useConnection';

import config from '../../config-common';
import SolanaRoute from './SolanaRoute';
import './SolanaEdit';
import './components/DefaultComponents';
import { WalletProvider } from './utils/wallet';
import WalletConnect from './components/WalletConnect';
import SolareaProgramApi from './program-api/solarea-program-api';

config.isClient = true;

const queryClient = new QueryClient();

export const solareaApi = new SolareaProgramApi();

const inject = (comp) => (
  <QueryClientProvider client={queryClient}>
    <ConnectionProvider cluster="devnet">
      <WalletProvider>
        <WalletConnect />
        {comp}
      </WalletProvider>
    </ConnectionProvider>
  </QueryClientProvider>
);

const App = () => {
  return inject(<SolanaRoute />);
};

render(html` <${App} />`, document.getElementById('app'));
