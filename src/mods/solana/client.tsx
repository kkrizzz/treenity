import React from 'react';
import 'regenerator-runtime/runtime';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { html, render } from 'htm/preact';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConnectionProvider } from './hooks/useConnection';

import config from '../../config-common';
import SolanaRoute from './SolanaRoute';
import './SolanaEdit';


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
  return inject(<SolanaRoute />);
};

render(html`
  <${App} />`, document.getElementById('app'));
