import React from 'react';
import useParams from './hooks/useParams';
import Render from './Render';

export default function SolanaRoute() {
  let [address, name, context] = useParams();
  if (!context) {
    context = name;
    name = 'default';
  }
  const ctx = `react${context && context !== 'react' ? ` ${context}` : ''}`;

  return <Render id={address} context={ctx} name={name} />;
}
