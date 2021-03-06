import React, { useEffect, useState } from 'react';
import ReactSimpleCodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another
import useParams from './hooks/useParams';
import { getFormData } from './utils/getFormData';
import { restStorageManager } from './rest-storage-manager';
import { addComponent } from './component-db';
import { loadScript } from './load-script';
import Render from './Render';
import { makeId } from './utils/make-id';
import { useQuery } from 'react-query';

const contexts = [
  'react',
  'react cell',
  'react list',
  'react card',
  'react thumbnail',
];

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    const { error } = this.state;
    if (error) {
      // You can render any custom fallback UI
      return <div className="card error">{error.message}</div>;
    }

    return this.props.children;
  }
}

function Preview({ accountData, code, id, name, context }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScript(makeId(id, name, context), code, {
      Render,
      add(component) {
        addComponent(id, name, context, {}, component);
      },
      onError(err) {
        this.add(() => <div className="card error" style={{ minWidth: 800 }}>{err.stack}</div>);
      },
    }).finally(() => setIsLoading(false));
  }, [code]);

  if (!code) return null;
  if (isLoading) return <div className="spinner" />;

  return <ErrorBoundary>
    <Render id={id} name={name} context={context || 'react'} />
  </ErrorBoundary>;
}


export default function SolanaEdit({ value, id, name, context }) {
  const [tab, setTab] = useState('edit');
  const [code, setCode] = useState('');
  const [link, setLink] = useState('');

  const _id = makeId(id, name, context);
  const { data: view, isLoading, refetch, ...rest } = useQuery(_id, () => restStorageManager.get(_id), {});
  useEffect(() => {
    if (!isLoading && view && rest) {
      setCode(view.data);
      setLink(view.link);
    }
  }, [_id, isLoading]);

  const tabs = (
    <div className="button-group">
      <button className={tab == 'edit' ? 'primary' : ''} onClick={() => setTab('edit')}>Edit</button>
      <button className={tab == 'preview' ? 'primary' : ''} onClick={() => setTab('preview')}>Preview</button>
    </div>
  );

  switch (tab) {
    case 'preview':
      return (
        <>
          {tabs}
          <Preview accountData={value} code={code} id={id} name={name} context={context} />
        </>
      );
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const { context, code } = getFormData(e);

    const linkId = link.includes('_') ? link : makeId(link, 'default', 'react');

    if (view) {
      restStorageManager.patch(view._id, { data: code, link: linkId }).catch(alert);
    } else {
      const _id = makeId(id, name, context);
      restStorageManager.create({ _id, data: code, link: linkId }).catch(alert);
    }
    refetch().catch(alert);
  };

  return (
    <>
      {tabs}
      <form onSubmit={onSubmit}>
        <fieldset>
          <legend>Component edit</legend>
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <label style={{ minWidth: 100, display: 'inline-block' }} htmlFor="username">
                Context
              </label>
              <select name="context" id="context" placeholder="Context">
                {contexts.map(context => (
                  <option value={context}>{context}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-6" style={{ display: 'flex' }}>
              <label style={{ minWidth: 100, display: 'inline-block' }} htmlFor="code">
                Code
              </label>
              <div style={{ display: 'inline-block' }}>
                <ReactSimpleCodeEditor
                  name="code"
                  value={code}
                  onValueChange={(code) => setCode(code)}
                  highlight={(code) => highlight(code, languages.js)}
                  padding={10}
                  disabled={!!link}
                  style={{
                    minHeight: 200,
                    width: 400,
                    fontSize: 14,
                    background: '#F8F8F8',
                    border: '1px solid rgb(221, 221, 221)',
                    margin: 'calc(var(--universal-margin) / 2)',
                    borderRadius: 'var(--universal-border-radius)',
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-6" style={{ display: 'flex' }}>
              <label style={{ minWidth: 100, display: 'inline-block' }} htmlFor="link">
                Link to ID
              </label>
              <input name="link" type="text" id="link" value={link} onChange={evt => setLink(evt.target.value)}
                     disabled={!!code}
              />
            </div>
          </div>
          <button type="submit" className="primary">
            Save
          </button>
          <a href="?" className="button secondary right">
            Go
          </a>
        </fieldset>
      </form>
    </>
  );
}

// addComponent('default', 'default', 'react edit', {}, SolanaEdit);
