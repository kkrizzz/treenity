import React from 'react';
import useParams from './hooks/useParams';
import useQueryParams from './hooks/useQueryParams';
import Render from './Render';
import SolanaEdit from './SolanaEdit';

export default function SolanaRoute() {
  let [id, name = 'default', context = 'react'] = useParams();

  const ctx = `react${context && context !== 'react' ? ` ${context}` : ''}`;

  const { edit } = useQueryParams();
  if (edit !== undefined) return <SolanaEdit id={id} name={name} context={ctx} />;

  return <Render id={id} context={ctx} name={name} />;
}
