import React, { useEffect, useState } from 'react';
import { components, loadScript } from './useAccount';

export const SolanaView = ({ view, accountData }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (view) {
        loadScript(view.address, 'react', view['react'])
            .then(() => setIsLoading(true));
    }
  }, []);

  if (!isLoading && view) return <div className="spinner" />;

  const Component = components[view?.address]?.['react'];
  if (!Component) return <div>
      <p onClick={()=>window.location.pathname+='/edit'}>
          This is the default view. Want to <span style={{color: '#104378', textDecoration: 'underline'}}>customize?</span>
      </p>
  </div>;

  return <Component context="react" data={accountData} address={view.address} />;
};
