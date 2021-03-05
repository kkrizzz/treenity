import React from 'react';
import { useSearchParams } from 'react-router-dom';


import { useAccount } from './hooks/useAccount';
import { useLoadAccountComponent } from './hooks/useLoadComponent';
import SolanaEdit from './SolanaEdit';

function useQueryParams(): { [name: string]: string } {
  const queryParams = window.location.search
    .slice(1)
    .split('&')
    .map(p => p.split('=').map(decodeURIComponent));
  const query = {};
  for (let [key, value] of queryParams) {
    query[key] = value;
  }
  return query;
}

function Render({ id, name, context }) {
  const { edit } = useQueryParams();
  const [accountInfo, isAccLoading] = useAccount(id);

  if (edit) return <SolanaEdit id={id} name={name} context={context} value={accountInfo} />;

  const [componentInfo, isLoading] = useLoadAccountComponent(id, name, context);

  if (isLoading || isAccLoading) return <div className="spinner" />;

  const { component: Component, props } = componentInfo;

  return <Component {...props} id={id} value={accountInfo} context={context} name={name} />;
}

export default Render;
