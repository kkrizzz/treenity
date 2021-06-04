import React from 'react';
import { useAccount } from './hooks/useAccount';
import { useLoadAccountComponent } from './hooks/useLoadComponent';

interface RenderProps {
  id: string;
  name?: string;
  context?: string;
  children?: any;
}

function Render({ id, name = 'default', context = 'react', children, ...more }: RenderProps) {
  console.log('rendering', id, name, context);
  const [componentInfo, isLoading] = useLoadAccountComponent(id, name, context);
  if (isLoading) return <div className="spinner" />;

  try {
    const { component: Component, props, needAccount } = componentInfo;

    if (needAccount) {
      const [accountInfo, isAccLoading] = useAccount(id);
      if (isAccLoading) {
        return <div className="spinner" />;
      }
      return (
        <Component
          {...more}
          {...props}
          id={id}
          value={accountInfo}
          context={context}
          name={name}
          children={children}
        />
      );
    }

    return (
      <Component {...more} {...props} id={id} context={context} name={name} children={children} />
    );
  } catch (e) {
    console.error('Render', id, context, name, e);
    return null;
  }
}

export default Render;
