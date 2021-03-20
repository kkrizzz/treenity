import React, { useEffect, useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import './SolanaEdit.css';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { getFormData } from './utils/getFormData';
import { restStorageManager } from './rest-storage-manager';
import { addComponent } from './component-db';
import { loadScript } from './load-script';
import Render from './Render';
import { makeId } from './utils/make-id';
import { useQuery } from 'react-query';
import { Icon } from './components/Icon';
import { Modal } from './components/Modal';
import { useAsyncDebounce } from './hooks/useAsyncDebounce';
import { throttle } from './hooks/throttle';
import { icons } from './components/icons';
import {key} from "./utils/keyCode";
import {toast} from "./utils/toast";

const contexts = [
  'react',
  'react cell',
  'react transaction',
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
      <Render id={id} name={name} context={context || 'react'} />
    </ErrorBoundary>
  );
}

function linkToHref(link: string) {
  const [id, ctx, name] = link.split('_');
  return `${id}/${name}/${ctx}`;
}

export default function SolanaEdit({ value, id, name, context }) {
  const [code, setCode] = useState('');
  const [initialCode, setInitialCode] = useState('');
  const [editorValue, setEditorValue] = useState('');
  const [showIsDraft, setShowIsDraft] = useState(false);
  const [link, setLink] = useState('');
  const [selectedContext, setSelectedContext] = useState(context);
  const [settingsIsVisible, showSettings] = useState(false);
  const [infoIsVisible, showInfo] = useState(false);

  const editor = React.useRef<any>();

  const _id = makeId(id, name, context);
  const { data: view, isLoading, refetch, ...rest } = useQuery(
    _id,
    () => restStorageManager.get(_id),
    {retry: false}
  );

  const draft_id = makeId(id, name + '_draft', context);
  const { data: draft, isLoading: draftIsLoading, refetch: refetchDraft } = useQuery(
    draft_id,
    () => restStorageManager.get(draft_id),
    {retry: false}
  );

  useEffect(() => {
    if (!draftIsLoading && draft && draft.data) {
      setInitialCode(draft.data);
      setCode(draft.data);
      setShowIsDraft(true);
    } else if (!isLoading && !draftIsLoading && view && rest && (!draft || draft && !draft.data)) {
      setInitialCode(view.data);
      setCode(view.data);
      setLink(view.link);
    }
  }, [_id, isLoading, draftIsLoading]);

  const rewindCodeToOriginal = () => {
    if (view) {
      setShowIsDraft(false);
      editor.current.editor.setValue(view.data);
      setCode(view.data);
      setEditorValue(view.data);
    }
  };

  const saveDraft = throttle((value) => {
    if (draft) {
      restStorageManager.patch(draft._id, { data: value }).catch();
    } else {
      const draft_id = makeId(id, name + '_draft', selectedContext);
      restStorageManager.create({ _id: draft_id, data: editorValue, link: '' }).catch();
    }
  }, 2000);

  const onSubmit = () => {
    const linkId = !link || link.includes('_') ? link : makeId(link, 'default', 'react');

    if (view) {
      restStorageManager.patch(view._id, { data: editorValue || code, link: linkId }).catch();
    } else {
      const _id = makeId(id, name, selectedContext);
      restStorageManager.create({ _id, data: editorValue, link: linkId }).catch();
    }
    refetch().catch(()=>toast('Sorry, something wrong :(')).then(()=>toast('Successful saved!'));
  };

  const openView = () => {
    window.open(`/${id}/${name}`, '_blank');
  };

  const renderTagAutoComplete = (cm, option) => {
    const targetStr = '<Render id="" name="default" context="react"/>';
    return new Promise(function (accept) {
      const {line, ch} = cm.getCursor();
      const lineText = cm.getLine(line);
      const template = /<R$|<Re$|<Ren$|<Rend$|<Rende$/;
      const match = lineText.match(template);
      const targetIndex = lineText.indexOf(match);
      if (targetIndex !== -1) {
        cm.doc.replaceRange(
          targetStr,
          {
            line,
            ch: ch - match[0].length
          },
          {
            line,
            ch: targetStr.length
          }
        );
      }
      accept(null);
    });
  };

  const updatePreview = (e) => {
    if(key.isCtrlEnter(e) || key.isCmdEnter(e)) {
      setCode(editorValue)
    }
  }

  return (
    <div onKeyUp={updatePreview}  style={{ display: 'flex', height: '100vh', maxHeight: '100vh' }}>
      <Modal
          transparent={false}
          isVisible={infoIsVisible}
          onBackdropPress={() => showInfo(false)}
      >
        <h4>Hotkeys</h4>
        <h5>Update preview <small>Ctrl+Enter or Cmd+Enter</small></h5>
        <h5>Auto Render complete <small>Ctrl+Space</small> </h5>
      </Modal>
      <Modal
        transparent={false}
        isVisible={settingsIsVisible}
        onBackdropPress={() => showSettings(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ width: 100, display: 'inline-block' }} htmlFor="username">
            Context
          </label>
          <select
            onChange={(e) => setSelectedContext(e.target.value)}
            name="context"
            id="context"
            value={selectedContext}
            placeholder="Context"
          >
            {contexts.map((context) => (
              <option selected={selectedContext === context} value={context}>
                {context}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ width: 100, display: 'inline-block' }} htmlFor="link">
            {link ? <a href={`/${linkToHref(link)}`}>Link to ID</a> : 'Link to ID'}
          </label>
          <input
            name="link"
            type="text"
            id="link"
            value={link}
            onChange={(evt) => setLink(evt.target.value)}
            style={{ width: '100%' }}
            disabled={!!editorValue}
          />
        </div>
      </Modal>
      {draft && draft.data && view && view.data !== draft.data && showIsDraft && (
        <span className="toast">
          This is a draft. press
          <Icon
            style={{
              display: 'inline-table',
              transform: 'scale(0.7, 0.7)',
              verticalAlign: 'middle',
            }}
            name="rewind"
          />
          to get original
        </span>
      )}
      <div className="solana-edit__toolbar min">
        <div className="solana-edit__toolbar-controls">
          <div>
            <Icon name="refresh" onClick={() => setCode(editorValue)} />
            <Icon name="save" onClick={() => onSubmit()} />
            <Icon name="play" onClick={() => openView()} />
            <Icon name="rewind" onClick={() => rewindCodeToOriginal()} />
          </div>
          <div>
            <Icon name="info" onClick={() => showInfo(true)} />
            <Icon name="settings" onClick={() => showSettings(true)} />
          </div>
        </div>
      </div>
      <div style={{ width: '50vw', display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
        <CodeMirror
          value={initialCode}
          ref={i => editor.current = i}
          options={{
            autoCloseTags: true,
            extraKeys: { 'Ctrl-Space': 'autocomplete' },
            mode: 'jsx',
            theme: 'material',
            lineNumbers: true,
            lineWrapping: true,
            htmlMode: true,
            hintOptions: { hint: renderTagAutoComplete },
          }}
          onChange={(editor, change, value) => {
            setEditorValue(value);
            saveDraft(value);
          }}
        />
      </div>
      <div style={{ width: '47vw' }}>
        {code && !draftIsLoading && (
          <Preview key={code} accountData={value} code={code} id={id} name={name} context={context} />
        )}
      </div>
    </div>
  );
}

// addComponent('default', 'default', 'react edit', {}, SolanaEdit);
