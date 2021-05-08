import React, { useEffect, useState } from 'react';
import { restStorageManager } from '../rest-storage-manager';
import Render from '../Render';
import { makeId } from '../utils/make-id';
import { useQuery } from 'react-query';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { throttle } from '../hooks/throttle';
import { key } from '../utils/keyCode';
import { toast } from '../utils/toast';
import useLongPress from '../hooks/useLongPress';
import { useWallet } from '../utils/wallet';
import { solareaApi } from '../client';
import { sendAndConfirmRawTransaction, Transaction } from '@solana/web3.js';
import { promiseSequence } from '../../../utils/promise-sequence';
import { useConnection } from '../hooks/useConnection';
import { createViewAddress } from '../program-api/solarea-program-api';
import { UploadFile } from '../components/FileUpload';
import { UploadPreview } from '../components/Files/UploadPreview';
import { mimeTypesData } from '../utils/mime-types-data';
import CodeMirror from './CodeMirror';

import './SolareaEdit.css';
import { Preview } from './Preview';
import { ErrorBoundary } from '../components/ErrorBoundary';

const contexts = [
  'react',
  'react cell',
  'react transaction',
  'react list',
  'react card',
  'react thumbnail',
];

function makeOutLink(link) {
  const [id, context, name] = link.split('_');
  return { id, context, name };
}

function linkToHref(link: string) {
  const [id, ctx, name] = link.split('_');
  return `${id}/${name}/${ctx}`;
}

const saveToSolana = async (buffer: string, dataType: number) => {
  if (!wallet || !connected) {
    return;
  }
  const [viewAddress] = createViewAddress(id, context, name);
  const account = await connection.getAccountInfo(viewAddress);
  const isUpdate = !!account;

  const data = Buffer.from(buffer);
  const [txs, publicKey] = solareaApi.createTransactions(
    wallet.publicKey,
    id,
    context,
    name,
    data,
    dataType,
    isUpdate,
  );

  // const blockhash = await getSolanaRecentBlockhash('devnet');

  const { blockhash } = await connection.getRecentBlockhash('finalized');
  txs.forEach((i) => {
    i.recentBlockhash = blockhash;
    i.feePayer = wallet.publicKey;
  });

  // console.log(transactions);

  const sendTransaction = (t: Transaction) =>
    sendAndConfirmRawTransaction(connection, t.serialize(), {
      skipPreflight: true,
      commitment: 'finalized',
    });

  try {
    const transactions = await wallet.signAllTransactions(txs);
    await promiseSequence(transactions.slice(0, 2).map((t) => () => sendTransaction(t)));

    await Promise.allSettled(transactions.slice(2).map(sendTransaction));

    console.log('data was saved to blockchain!', publicKey.toBase58());
  } catch (err) {
    console.error('cant save to solana', err);
  }
};

export default function SolanaEdit({ value, id, name, context, ...params }) {
  const { signed, wallet, session, connected } = useWallet();
  const connection = useConnection();
  const [code, setCode] = useState('');
  const [initialCode, setInitialCode] = useState('');
  const [editorValue, setEditorValue] = useState('');
  const [inCodePreview, setInCodePreview] = useState<any>(undefined);
  const [showIsDraft, setShowIsDraft] = useState(false);
  const [link, setLink] = useState('');
  const [selectedContext, setSelectedContext] = useState(context);
  const [infoIsVisible, showInfo] = useState(false);

  const [file, setFile] = useState<{ src: File; binary: string } | null>(null);

  const renderPreviewLongPress = useLongPress((e) => parseInCodePreview(e), 1500);

  const editor = React.useRef<any>();
  const linkInput = React.useRef<any>();

  const _id = makeId(id, name, context);
  const { data: view, isLoading, refetch, ...rest } = useQuery(
    _id,
    () => restStorageManager.get(_id),
    { retry: false },
  );

  const draftId = makeId(id, name + '_draft', context);
  const { data: draft, isLoading: draftIsLoading, refetch: refetchDraft } = useQuery(
    draftId,
    () => restStorageManager.get(draftId),
    { retry: false },
  );

  useEffect(() => {
    if (!draftIsLoading && draft && draft.data) {
      setInitialCode(draft.data);
      setEditorValue(draft.data);
      setCode(draft.data);
      setShowIsDraft(true);
    } else if (
      !isLoading &&
      !draftIsLoading &&
      view &&
      rest &&
      (!draft || (draft && !draft.data))
    ) {
      setInitialCode(view.data);
      setEditorValue(view.data);
      setCode(view.data);
      setLink(view.link);
    }
  }, [_id, isLoading, draftIsLoading]);

  const parseInCodePreview = (e: MouseEvent) => {
    const { editor: i } = editor.current;
    const { line } = i.coordsChar({ left: e.clientX, top: e.clientY });
    const lineContent = i.getLine(line);
    const matcher = /(\w+)=("[^<>"]*"|'[^<>']*'|\w+)/gi;
    const targetAtrr: any = {};

    lineContent.match(matcher)?.forEach((attr) => {
      const splitAttr = attr.split('=');
      targetAtrr[splitAttr[0]] = splitAttr[1].replace(/"/g, '');
    });
    if (!targetAtrr.id) return;

    setInCodePreview(targetAtrr);
  };

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
      restStorageManager.patch(draft._id, { data: value }, session).catch();
    } else {
      const draft_id = makeId(id, name + '_draft', selectedContext);
      restStorageManager
        .create({ _id: draft_id, data: editorValue, link: '' }, session)
        .then((res) => console.log('draft created', res))
        .catch();
    }
  }, 2000);

  const onSubmit = () => {
    const linkId = !link || link.includes('_') ? link : makeId(link, 'default', 'react');

    if (view) {
      restStorageManager
        .patch(
          view._id,
          { data: editorValue || code, link: linkId, owner: wallet.publicKey.toBase58() },
          session,
        )
        .then(() => toast('Successful saved!'))
        .catch(() => toast('Permission denied', 5000, '#ea4545'));
    } else {
      const _id = makeId(id, name, selectedContext);
      restStorageManager
        .create(
          { _id, data: editorValue, link: linkId, owner: wallet.publicKey.toBase58() },
          session,
        )
        .then(() => toast('New view was created!'))
        .catch();
    }
    refetch().catch(() => toast('Sorry, something wrong :('));
  };

  const openView = () => {
    window.open(`/${id}/${name}`, '_blank');
  };

  const renderTagAutoComplete = (cm, option) => {
    const targetStr = '<Render id="" name="default" context="react"/>';
    return new Promise(function (accept) {
      const { line, ch } = cm.getCursor();
      const lineText = cm.getLine(line);
      const template = /<R$|<Re$|<Ren$|<Rend$|<Rende$/;
      const match = lineText.match(template);
      const targetIndex = lineText.indexOf(match);
      if (targetIndex !== -1) {
        cm.doc.replaceRange(
          targetStr,
          {
            line,
            ch: ch - match[0].length,
          },
          {
            line,
            ch: targetStr.length,
          },
        );
      }
      accept(null);
    });
  };

  const updatePreview = (e) => {
    if (key.isCtrlEnter(e) || key.isCmdEnter(e)) {
      setCode(editorValue);
    }
  };

  const onBlurLinkInput = () => {
    const { value } = linkInput.current;
    const linkId = !value || value.includes('_') ? value : makeId(value, 'default', 'react');
    setLink(linkId);
    linkInput.current.value = linkId;
  };

  return (
    <div onKeyUp={updatePreview} className="solarea-edit">
      <Modal
        top="10%"
        width={800}
        transparent={false}
        isVisible={!!inCodePreview}
        onBackdropPress={() => setInCodePreview(undefined)}
      >
        {!!inCodePreview && <Render {...inCodePreview} />}
      </Modal>
      <Modal
        width={800}
        transparent={false}
        isVisible={!!file}
        onBackdropPress={() => setFile(null)}
      >
        <div>
          {file && <UploadPreview binary={file!.binary} src={file!.src} />}
          <button
            onClick={() => {
              if (!file) return;
              saveToSolana(file.binary, mimeTypesData[file.src.type]);
            }}
          >
            Upload to Solana!
          </button>
        </div>
      </Modal>
      <Modal transparent={false} isVisible={infoIsVisible} onBackdropPress={() => showInfo(false)}>
        <h3>Hotkeys</h3>
        <h5>
          Update preview <small>Ctrl+Enter or Cmd+Enter</small>
        </h5>
        <h5>
          Auto Render complete <small>Ctrl+Space</small>{' '}
        </h5>
        <h3>Hints</h3>
        <h5>
          <small>To add Link, clear your code</small>
        </h5>
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
      <div className="solarea-edit__toolbar min">
        <div className="solarea-edit__toolbar-controls">
          <div>
            <Icon name="refresh" onClick={() => setCode(editorValue)} />
            <Icon name="save" onClick={() => onSubmit()} />
            <Icon name="solana" onClick={() => saveToSolana(editorValue, 0x1)} />
            <Icon name="play" onClick={() => openView()} />
            <Icon name="rewind" onClick={() => rewindCodeToOriginal()} />
            <UploadFile
              onChangeFile={(file: File, binary: any) => setFile({ src: file, binary })}
              returnFormat="binary"
            >
              <Icon name="upload" />
            </UploadFile>
          </div>
          <div>
            <Icon name="info" onClick={() => showInfo(true)} />
          </div>
        </div>
      </div>
      <div style={{ width: '50vw', display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
        <div className="solarea-edit_workspace-toolbar">
          <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
            <label style={{ marginLeft: 4, width: 60, display: 'inline-block' }} htmlFor="username">
              Context
            </label>
            <select
              style={{ width: 170, height: 38 }}
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
          <div
            style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', width: '100%' }}
          >
            <label
              style={{
                marginRight: 4,
                width: 60,
                display: 'inline-block',
                whiteSpace: 'nowrap',
                color: 'white',
              }}
              htmlFor="link"
            >
              {link ? (
                <a target="_blank" href={`/${linkToHref(link)}`}>
                  Link to ID
                </a>
              ) : (
                'Link to ID'
              )}
            </label>
            <input
              ref={linkInput}
              onBlur={onBlurLinkInput}
              onKeyUp={(e) => {
                if (key.isEnter(e)) {
                  onBlurLinkInput();
                  e.stopPropagation();
                }
              }}
              style={{ width: '100%', minWidth: 170, height: 38, marginLeft: 8 }}
              name="link"
              type="text"
              id="link"
              defaultValue={link}
              disabled={!!editorValue}
            />
          </div>
        </div>
        <CodeMirror
          {...renderPreviewLongPress}
          value={editorValue}
          // options={{
          //   resetSelectionOnContextMenu: false,
          //   readOnly: !!link,
          //   tabSize: 2,
          //   autoCloseTags: true,
          //   extraKeys: {
          //     'Ctrl-Space': 'autocomplete',
          //     'Ctrl-LeftClick': function (cm, e) {
          //       // its a redefine
          //     },
          //   },
          //   mode: 'jsx',
          //   theme: 'material',
          //   lineNumbers: true,
          //   lineWrapping: false,
          //   htmlMode: true,
          //   hintOptions: { hint: renderTagAutoComplete },
          // }}
          // forwardRef={(i) => (editor.current = i)}
          onChange={(editor, change, value) => {
            setEditorValue(value);
            saveDraft(value);
            //markEditorText(editor, /<Render[\s\S]*\/>/, 'render-highlight')
          }}
        />
      </div>
      <div style={{ width: '47vw' }}>
        {link ? (
          <ErrorBoundary>
            <Render {...params} key={makeOutLink(link).id} {...makeOutLink(link)} />
          </ErrorBoundary>
        ) : (
          code &&
          !draftIsLoading && (
            <Preview
              {...params}
              key={code}
              accountData={value}
              code={code}
              id={id}
              name={name}
              context={context}
            />
          )
        )}
      </div>
    </div>
  );
}

// addComponent('default', 'default', 'react edit', {}, SolanaEdit);
