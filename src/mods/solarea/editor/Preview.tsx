import React, { useEffect, useState } from 'react';
import { loadScript } from '../load-script';
import { makeId } from '../utils/make-id';
import Render from '../Render';
import { addComponent } from '../component-db';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useEditorSelect } from '../stores/editor-store';

export function Preview({ accountData, code, id, name, context, ...params }) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentAddress] = useEditorSelect('currentAddress');

  useEffect(() => {
    loadScript(makeId(id, name, context), code, {
      Render,
      add(component) {
        addComponent(currentAddress || id, name, context, {}, component);
      },
      onError(err) {
        this.add(() => (
          <div className="card error" style={{ maxWidth: '400px' }}>
            {err.stack}
          </div>
        ));
      },
    }).finally(() => setIsLoading(false));
  }, [code, currentAddress]);

  if (!code) return null;
  if (isLoading) return <div className="spinner" />;

  return (
    <ErrorBoundary>
      <Render {...params} id={currentAddress || id} name={name} context={context || 'react'} />
    </ErrorBoundary>
  );
}
