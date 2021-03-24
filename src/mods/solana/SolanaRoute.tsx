import React from 'react';
import useParams from './hooks/useParams';
import useQueryParams from './hooks/useQueryParams';
import Render from './Render';
import SolanaEdit from './SolanaEdit';

export default function SolanaRoute() {
  let [id, name, context] = useParams();

  const ctx = `react${context && context !== 'react' ? ` ${context}` : ''}`;

  const { edit, ...props } = useQueryParams();
  if (edit !== undefined) return <SolanaEdit {...props} value={null} id={id} name={name} context={ctx} />;

  if (id === 'layout') {
    return <Render id={id} context={ctx} name={name} />;
  }

  return <Render id="layout" context={ctx}>
    <Render {...props} id={id} context={ctx} name={name} />
  </Render>;
}
