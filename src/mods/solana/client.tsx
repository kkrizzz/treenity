import React, {useEffect} from 'react';
import 'regenerator-runtime/runtime';
import {html, render} from 'htm/preact';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ConnectionProvider} from './hooks/useConnection';

import config from '../../config-common';
import SolanaRoute from './SolanaRoute';
import './SolanaEdit';
import './components/SolanaVIew';
import {SolongWalletAdapter} from "./wallet-adapters/solong";
import {WalletProvider} from "./utils/wallet";
import WalletConnect from "./components/WalletConnect";


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
    return inject(
        <WalletProvider>
            <WalletConnect/>
            <SolanaRoute/>
        </WalletProvider>
    );
};

render(html`
  <${App} />`, document.getElementById('app'));
