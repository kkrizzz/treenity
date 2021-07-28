import React, { useEffect, useState } from 'react';
import { loadedScripts, loadScript } from '../load-script';
import { makeId } from '../utils/make-id';
import Render, { render } from '../Render';
import { addComponent, getComponent } from '../component-db';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useEditorSelect } from '../stores/editor-store';

export function Preview({ accountData, code, id, name, context, ...params }) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentAddress] = useEditorSelect('currentAddress');

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadScript(makeId(currentAddress || id, name, context), code, {
        Render,
        render,
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
      });
      setIsLoading(false);
    })();
  }, [code, currentAddress]);

  if (!code && !currentAddress) return null;
  if (isLoading) return <div className="spinner" />;

  return (
    <ErrorBoundary>
      <Render {...params} id={currentAddress || id} name={name} context={context || 'react'} />
    </ErrorBoundary>
  );
}
