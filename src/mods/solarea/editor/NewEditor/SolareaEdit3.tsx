import React, { useCallback, useEffect, useState } from 'react';
import CodeMirror from '../CodeMirror';
import { DeviceScaleFrame } from '../DeviceScaleFrame';
import { Preview } from '../Preview';
import { Icon } from '../../components/Icon';
import './SolareaEdit.scss';
import { MenuItem } from './EditorMenu';
import { UploadFile } from '../../components/FileUpload';
import { Tooltip } from './Tooltip';

import useEditorStore from '../../stores/editor-store';
import { Accordion } from '../../components/Accordion';
import { Modal } from '../../components/Modal/Modal';
import { UploadPreview } from '../../components/Files/UploadPreview';
import { Snippets } from './Snippets';
import { makeId } from '../../utils/make-id';
import { restStorageManager } from '../../rest-storage-manager';
import { error, toast } from '../../utils/toast';
import { useWallet } from '../../utils/wallet';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import Render from '../../Render';
import { createViewAddress } from '../../program-api/solarea-program-api';
import { solareaApi } from '../../client';
import { sendAndConfirmRawTransaction, Transaction } from '@solana/web3.js';
import { promiseSequence } from '../../../../utils/promise-sequence';
import { useConnection } from '../../hooks/useConnection';
import { calcRentFee } from '../../utils/calcRentFee';
import { mimeTypesData } from '../../utils/mime-types-data';
import { useHotkeys } from 'react-hotkeys-hook';

function makeOutLink(link) {
  const [id, context, name] = link.split('~');
  return { id, context, name };
}

const CodeUploaderWithPreview = ({ view, editorValue, uploadToSolanaStarted }) => {
  return (
    <div>
      <div>
        {view &&
          !view.fromMongo &&
          'Code with this id now stored on Solana.\n Remove transaction fee price is 0.00005 SOL'}
      </div>
      <div>File size: {editorValue.length} bytes</div>
      <div>Store price: {calcRentFee(editorValue.length).toFixed(6)} SOL</div>
      <div>
        Solana fee:{' '}
        {(
          Math.ceil(editorValue.length / 1024) * 0.000005 +
          (view && view.fromMongo ? 0 : view && view.fromMongo != undefined ? 0.000005 : 0)
        ).toFixed(6)}{' '}
        SOL
      </div>
      <div>
        {!uploadToSolanaStarted ? (
          'Upload not started'
        ) : (
          <div>
            Uploading . . .<span className="spinner"></span>
          </div>
        )}
      </div>
    </div>
  );
};

const FileUploaderWithPreview = ({ saveFn, uploadToSolanaStarted }) => {
  const [file, setFile, view] = useEditorStore((state) => [state.file, state.setFile, state.view]);
  if (!file || !file.src) return null;
  return (
    <div>
      {file.binary && file.src && <UploadPreview binary={file!.binary} src={file!.src!} />}
      <button
        onClick={() => {
          if (!file) return;
          saveFn(file.binary, mimeTypesData[file.src!.type], () => {
            setFile(null);
          });
        }}
      >
        Upload to Solana!
      </button>
      <div>
        {uploadToSolanaStarted ? (
          <div>
            Upload started <span className="spinner" />
          </div>
        ) : (
          'Upload not started yet'
        )}
      </div>
    </div>
  );
};

const EditorWidthController = () => {
  const [editorMaxWidth, setEditorMaxWidth] = useEditorStore((state) => [
    state.editorMaxWidth,
    state.setEditorMaxWidth,
  ]);

  // const [width, setWidth] = React.useState(680);
  const toggleEditor = useCallback(() => {
    setEditorMaxWidth(editorMaxWidth ? 0 : 680);
  }, [editorMaxWidth, setEditorMaxWidth]);
  useHotkeys('cmd+alt+/,ctrl+alt+/', toggleEditor, [toggleEditor]);
  //
  // useEffect(() => {
  //   setEditorMaxWidth(width);
  // }, [width]);

  return (
    <div
      className="sol-editor-width-controller"
      onClick={() => setEditorMaxWidth(editorMaxWidth ? 0 : 680)}
    >
      <div>
        <Icon name={editorMaxWidth ? 'back_arrow' : 'forward'} />
      </div>
    </div>
  );
};

const SolareaEditMenu = ({ id, name }) => {
  const [
    code,
    setCode,
    editorValue,
    view,
    link,
    loadInitialCode,
    file,
    setFile,
    selectedContext,
    showHotkeys,
    toggleShowHotkeys,
  ] = useEditorStore((state) => [
    state.code,
    state.setCode,
    state.editorValue,
    state.view,
    state.link,
    state.loadInitialCode,
    state.file,
    state.setFile,
    state.selectedContext,
    state.showHotkeys,
    state.toggleShowHotkeys,
  ]);

  const [uploadingToSolana, setUploadingToSolana] = useState(false);
  const [uploadToSolanaStarted, setUploadToSolanaStarted] = useState(false);
  const { session, signed, connected, wallet, select, authorizeWithTx } = useWallet();
  const connection = useConnection();

  const saveToMongo = async () => {
    if (!wallet || !connected || !session) {
      select();
      return toast('Please connect wallet');
    }

    try {
      await authorizeWithTx();
    } catch (e) {}

    const linkId = !link || link.includes('~') ? link : makeId(link, 'default', 'react');

    try {
      if (view && view.fromMongo) {
        await restStorageManager.patch(
          view._id,
          { data: editorValue || code, link: linkId, owner: wallet.publicKey.toBase58() },
          session,
        );
      } else {
        const _id = makeId(id, name, selectedContext);
        await restStorageManager.create(
          { _id, data: editorValue, link: linkId, owner: wallet.publicKey.toBase58() },
          session,
        );
      }
      await loadInitialCode(id, name, selectedContext);
      toast('Successful saved');
    } catch (err) {
      console.dir(err);
      error(`Cant save: ${err.message} ${err.code || ''}`);
    }
  };

  const saveToSolana = async (buffer: string, dataType: number, callback?: () => void) => {
    if (!wallet || !connected || !session) {
      select();
      return toast('Please connect wallet');
    }

    const [viewAddress] = createViewAddress(id, selectedContext, name);
    const account = await connection.getAccountInfo(viewAddress);
    const isUpdate = !!account;
    const data = Buffer.from(buffer);
    const [txs, storageAddress] = solareaApi.createTransactions(
      wallet.publicKey,
      id,
      selectedContext,
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
    const sendTransaction = (t: Transaction) =>
      sendAndConfirmRawTransaction(connection, t.serialize(), {
        skipPreflight: true,
        commitment: 'finalized',
      });
    try {
      setUploadingToSolana(true);
      const transactions = await wallet.signAllTransactions(txs);

      setUploadToSolanaStarted(true);
      await promiseSequence(transactions.slice(0, 2).map((t) => () => sendTransaction(t)));
      await Promise.allSettled(transactions.slice(2).map(sendTransaction));
      await loadInitialCode(id, name, selectedContext);
      toast('Code was saved to blockchain!');
      console.log('storageAddress - ', storageAddress);
      setUploadingToSolana(false);
      setUploadToSolanaStarted(false);
      callback?.();
    } catch (err) {
      toast('Sorry, something went wrong :(', 5000, '#ea4545');
      setUploadingToSolana(false);
      setUploadToSolanaStarted(false);
      callback?.();
    }
  };

  const openView = () => {
    window.open(`/${id}/${name}`, '_blank');
  };

  return (
    <div className="sol-menu-markup">
      <div className="sol-menu-markup-list">
        <MenuItem onClick={() => setCode(editorValue)} icon="refresh" title="Update preview" />
        <MenuItem onClick={saveToMongo} icon="save" title="Store" />
        <MenuItem
          onClick={() => saveToSolana(editorValue, 0x1)}
          icon="solana"
          title="Store onchain"
        />

        <MenuItem onClick={openView} icon="play" title="Open view" />

        <Tooltip text="Upload file" className="sol-menu-item">
          <UploadFile onChangeFile={setFile} returnFormat="binary">
            <Icon name="upload" />
          </UploadFile>
        </Tooltip>

        <MenuItem icon="info" title="hotkeys" onClick={toggleShowHotkeys} />

        <Modal header="Hotkeys" isOpen={showHotkeys} onClose={toggleShowHotkeys}>
          <h4>
            Update preview<small>alt+1</small>
            Hide editor<small>alt+2</small>
          </h4>
        </Modal>

        <Modal
          header="Code upload process"
          isOpen={uploadingToSolana && file && !file.src}
          onClose={() => setUploadingToSolana(false)}
        >
          <CodeUploaderWithPreview
            view={view}
            editorValue={editorValue}
            uploadToSolanaStarted={uploadToSolanaStarted}
          />
        </Modal>

        <Modal isOpen={!!file.binary} onClose={() => setFile({ src: null, binary: '' })}>
          <FileUploaderWithPreview
            saveFn={saveToSolana}
            uploadToSolanaStarted={uploadToSolanaStarted}
          />
        </Modal>
      </div>
    </div>
  );
};

const SolareaEditPreview = ({ value, id, name, ...params }) => {
  const [code, link, selectedContext] = useEditorStore((state) => [
    state.code,
    state.link,
    state.selectedContext,
  ]);

  return (
    <div className="sol-markup-preview">
      <DeviceScaleFrame>
        {link ? (
          <ErrorBoundary>
            <Render {...params} key={makeOutLink(link).id} {...makeOutLink(link)} />
          </ErrorBoundary>
        ) : (
          code && (
            <Preview
              {...params}
              key={code}
              accountData={value}
              code={code}
              id={id}
              name={name}
              context={selectedContext}
            />
          )
        )}
      </DeviceScaleFrame>
    </div>
  );
};

export const SolareaEdit = ({ value, id, name, context, ...params }) => {
  const [setEditorValue, editorMaxWidth, initialCode, loadInitialCode] = useEditorStore((state) => [
    state.setEditorValue,
    state.editorMaxWidth,
    state.initialCode,
    state.loadInitialCode,
  ]);

  useEffect(() => {
    loadInitialCode(id, name, context);
  }, []);

  return (
    <div className="sol-markup-wr">
      <SolareaEditMenu id={id} name={name} />
      <Snippets />
      <div
        style={{
          maxWidth: editorMaxWidth,
          width: '100%',
          transition: 'max-width 0.5s ease-in-out',
          backgroundColor: '#282c33',
        }}
      >
        <CodeMirror
          value={initialCode}
          onChange={(value) => {
            setEditorValue(value);
          }}
        />
      </div>
      <EditorWidthController />
      <SolareaEditPreview id={id} value={value} name={name} {...params} />
    </div>
  );
};
