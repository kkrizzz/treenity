import React, { useEffect, useState } from 'react';
import { loadScript } from '../load-script';
import { makeId } from '../utils/make-id';
import Render from '../Render';
import { addComponent } from '../component-db';
import { ErrorBoundary } from '../components/ErrorBoundary';

export function Preview({ accountData, code, id, name, context, ...params }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScript(makeId(id, name, context), code, {
      Render,
      add(component) {
        addComponent(id, name, context, {}, component);
      },
      onError(err) {
        this.add(() => (
          <div className="card error" style={{ maxWidth: '400px' }}>
            {err.stack}
          </div>
        ));
      },
    }).finally(() => setIsLoading(false));
  }, [code]);

  if (!code) return null;
  if (isLoading) return <div className="spinner" />;

  return (
    <ErrorBoundary>
      <Render {...params} id={id} name={name} context={context || 'react'} />
    </ErrorBoundary>
  );
}
