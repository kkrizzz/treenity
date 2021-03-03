import React from 'react';
import 'regenerator-runtime/runtime';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { html, render } from 'htm/preact';

import config from '../../config-common';
import Solana from './Solana';
import SolanaCreate from './SolanaCreate';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConnectionProvider } from './useConnection';

config.isClient = true;

const queryClient = new QueryClient();

const inject = (comp) => (
  <QueryClientProvider client={queryClient}>
    <ConnectionProvider>
      {comp}
    </ConnectionProvider>
  </QueryClientProvider>
);

const App = () => {
  return inject(<Solana />);
};

render(html`
  <${App} />`, document.getElementById('app'));
