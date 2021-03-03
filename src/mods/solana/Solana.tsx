import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SolanaCreate from './SolanaCreate';
import { useAccountComponent } from './useAccount';
import { ConnectionProvider } from './useConnection';
import useParams from './useParams';


export default function Solana() {
  const [address, name = 'any'] = useParams();

  switch (name) {
    case 'create':
      return <SolanaCreate />;
  }

  const [Component, loading, data] = useAccountComponent(address, 'react', name);

  return Component &&
    <Component address={address} data={data} name={name} context="react" />;
}
