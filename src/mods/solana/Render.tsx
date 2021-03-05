import React from 'react';

import { useAccount } from './hooks/useAccount';
import { useLoadAccountComponent } from './hooks/useLoadComponent';


function Render({ id, name, context }) {
  const [componentInfo, isLoading] = useLoadAccountComponent(id, name, context);
  const [accountInfo, isAccLoading] = useAccount(id);

  if (isLoading || isAccLoading) return <div className="spinner" />;

  const { component: Component, props } = componentInfo;

  return <Component {...props} id={id} value={accountInfo} context={context} name={name} />;
}

export default Render;
