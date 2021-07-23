import React, { useCallback, useEffect, useState } from 'react';
import CodeMirror from '../CodeMirror';
import { Icon } from '../../components/Icon';
import './SolareaEdit.scss';
import { MenuItem } from './EditorMenu';
import { UploadFile } from '../../components/FileUpload';
import { Tooltip } from './Tooltip';

import useEditorStore from '../../stores/editor-store';
import { Modal } from '../../components/Modal/Modal';
import { UploadPreview } from '../../components/Files/UploadPreview';
import { Snippets } from './Snippets';
import { error, toast } from '../../utils/toast';
import { calcRentFee } from '../../utils/calcRentFee';
import { mimeTypesData } from '../../utils/mime-types-data';
import { useHotkeys } from 'react-hotkeys-hook';
import { SolareaViewId } from '../../storage-adapters/SolareaViewId';
import { SolareaEditPreview } from './Preview';
import { useSolanaStorage, useRestStorage } from '../../storage-adapters/StorageProvider';
import { SolareaLinkData, SolareaViewData } from '../../storage-adapters/IStorageAdapter';

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
          saveFn(file.binary, mimeTypesData[file.src!.type]).finally(() => {
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
    setCurrentAddress,
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
    state.setCurrentAddress,
  ]);

  const [uploadingToSolana, setUploadingToSolana] = useState(false);
  const [uploadToSolanaStarted, setUploadToSolanaStarted] = useState(false);

  const restStorage = useRestStorage();
  const solanaStorage = useSolanaStorage();

  // const { session, signed, connected, wallet, select, authorizeWithTx } = useWallet();
  // const connection = useConnection();

  const getSaveData = () => {
    const linkId = link && link.includes('~') ? SolareaViewId.fromString(link) : undefined;

    const viewId = new SolareaViewId(id, name, selectedContext);
    const viewData = linkId
      ? new SolareaLinkData(viewId, linkId)
      : new SolareaViewData(viewId, mimeTypesData['solarea/jsx'], Buffer.from(editorValue));

    return viewData;
  };

  const saveToMongo = async () => {
    try {
      await restStorage.save(getSaveData());

      await loadInitialCode(id, name, selectedContext);
      toast('Successfully saved');
    } catch (err) {
      console.dir(err);
      error(`Cant save: ${err.message} ${err.code || ''}`);
    }
  };

  const saveToSolana = async () => {
    try {
      setUploadingToSolana(true);
      setUploadToSolanaStarted(true);

      await solanaStorage.save(getSaveData()).finally(() => {
        setUploadingToSolana(false);
        setUploadToSolanaStarted(false);
      });

      await loadInitialCode(id, name, selectedContext);
    } catch (err) {
      return toast('Sorry, something went wrong', 5000, '#f1224b');
    }
  };

  const openView = () => {
    window.open(`/${id}/${name}`, '_blank');
  };

  return (
    <div className="sol-menu-markup">
      <div className="sol-menu-markup-list">
        <MenuItem
          onClick={() => {
            setCode(editorValue);
          }}
          icon="refresh"
          title="Update preview"
        />
        <MenuItem onClick={saveToMongo} icon="save" title="Store" />
        <MenuItem onClick={() => saveToSolana()} icon="solana" title="Store onchain" />

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
