import React, { useEffect, useState } from 'react';
import { loadScript } from '../../uix/compiler/load-script';
import { makeUrl } from '../utils/make-url';
import Render, { render } from '../render/Render';
import { addComponent } from '../../uix/db/component-db';
import { ErrorBoundary } from '../../uix/utils/ErrorBoundary';
import { useEditorSelect } from '../stores/editor-store';
import { createExecutionContext } from '../../uix/compiler/create-execution-context';
import { GlobalCSSRender } from '../../uix/utils/GlobalCSSRender';
import useParams from '../hooks/useParams';

export function Preview({ accountData, code, id, name, context, ...params }) {
  const [isLoading, setIsLoading] = useState(true);
  let [, , , hostname] = useParams();
  const [currentAddress] = useEditorSelect('currentAddress');

  const [value, onChange] = useState(accountData);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadScript(makeUrl(currentAddress || id, name, context), code, {
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
