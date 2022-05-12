import React from 'react';
import { html, render } from 'htm/preact';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { ConnectionProvider } from './hooks/useConnection';

// XXX global imports
import '../uix/systemjs-addons/css';
import '../uix/systemjs-addons/solarea';
import './global-imports';
// import './index.css';

import config from '../../config-common';
config.isClient = true;

import SolareaRoute from './SolareaRoute';
import './components/DefaultComponents';
// import { WalletProvider } from './utils/wallet';
// import WalletConnect from './components/WalletConnect';
// import SolareaProgramApi from './program-api/solarea-program-api';
import { StorageProvider } from '../uix/storage/adapters/StorageProvider';
import { GlobalCSSRender } from '../uix/utils/GlobalCSSRender';
import { ErrorBoundary } from '../uix/utils/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// export const solareaApi = new SolareaProgramApi();

const inject = (comp) => (
  <ErrorBoundary>
    <GlobalCSSRender />
    <QueryClientProvider client={queryClient}>
      {/*<WalletProvider>*/}
      {/*  <WalletConnect />*/}
      <StorageProvider>{comp}</StorageProvider>
      {/*</WalletProvider>*/}
    </QueryClientProvider>
  </ErrorBoundary>
);

const App = () => {
  return inject(<SolareaRoute />);
};

// navigator.serviceWorker.register('./solarea-worker').then(() => {
//   console.log("Install succeeded with the default scope '/'.");
// });

render(html`<${App} />`, document.getElementById('app')!);
