import { useParams } from 'react-router-dom';
import { useAccountComponent } from './useAccount';
import { ConnectionProvider } from './useConnection';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';


export default function Solana() {
  const { address, name = 'any' } = useParams();

  // const [Component, loading, data] = useAccountComponent(address, 'react', name);
  return <div>{address}</div>;
}
