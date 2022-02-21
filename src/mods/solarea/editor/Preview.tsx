import React, { useEffect, useState } from 'react';
import { loadScript } from '../compiler/load-script';
import { makeId } from '../utils/make-id';
import Render, { render } from '../render/Render';
import { addComponent } from '../component-db';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useEditorSelect } from '../stores/editor-store';
import { createExecutionContext } from '../utils/create-execution-context';
import { GlobalCSSRender } from '../utils/GlobalCSSRender';
import useParams from '../hooks/useParams';

export function Preview({ accountData, code, id, name, context, ...params }) {
  const [isLoading, setIsLoading] = useState(true);
  let [, , , hostname] = useParams();
  const [currentAddress] = useEditorSelect('currentAddress');

  const [value, onChange] = useState(accountData);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadScript(makeId(currentAddress || id, name, context), code, {
        ...createExecutionContext(),
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

  const Component = () => (
    <Render
      value={value}
      onChange={onChange}
      {...params}
      id={currentAddress || id}
      name={name}
      context={context || 'react'}
    />
  );

  return (
    <ErrorBoundary>
      <GlobalCSSRender />
      <Render
        id={hostname || currentAddress || id}
        name={'preview-layout'}
        context={context || 'react'}
        fallback={Component}
      >
        {Component()}
      </Render>
    </ErrorBoundary>
  );
}
