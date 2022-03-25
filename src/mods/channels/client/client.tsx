import React from 'react';

// import { render } from 'react-dom';
const { NodeGraph } = require('./NodeGraph');

const inject = (comp) => comp;
// <QueryClientProvider client={queryClient}>
//   <GlobalCSSRender />
//   <WalletProvider>
//     <WalletConnect />
//     <StorageProvider>{comp}</StorageProvider>
//   </WalletProvider>
// </QueryClientProvider>

const App = () => {
  return inject(<NodeGraph />);
};

// navigator.serviceWorker.register('./solarea-worker').then(() => {
//   console.log("Install succeeded with the default scope '/'.");
// });

// render(<App />, document.getElementById('app')!);
