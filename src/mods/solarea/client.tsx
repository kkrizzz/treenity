import React from 'react';
import { html, render } from 'htm/preact';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConnectionProvider } from './hooks/useConnection';

// XXX global imports
import './systemjs-addons/css';
import './systemjs-addons/solarea';
import './global-imports';
import './index.css';

import config from '../../config-common';
import SolareaRoute from './SolareaRoute';
import './components/DefaultComponents';
import { WalletProvider } from './utils/wallet';
import WalletConnect from './components/WalletConnect';
import SolareaProgramApi from './program-api/solarea-program-api';
import { StorageProvider } from './storage-adapters/StorageProvider';
import { GlobalCSSRender } from './utils/GlobalCSSRender';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const solareaApi = new SolareaProgramApi();

const inject = (comp) => (
  <QueryClientProvider client={queryClient}>
    <GlobalCSSRender />
    <WalletProvider>
      <WalletConnect />
      <StorageProvider>{comp}</StorageProvider>
    </WalletProvider>
  </QueryClientProvider>
);

const App = () => {
  return inject(<SolareaRoute />);
};

// navigator.serviceWorker.register('./solarea-worker').then(() => {
//   console.log("Install succeeded with the default scope '/'.");
// });

render(html`<${App} />`, document.getElementById('app')!);
