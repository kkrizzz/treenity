import React, { useState } from 'react';
import useEditorStore from '../../stores/editor-store';
import { UploadPreview } from '../../components/Files/UploadPreview';
import { mimeTypesData } from '../../utils/mime-types-data';
import { useRestStorage, useSolanaStorage } from '../../storage-adapters/StorageProvider';
import { SolareaViewId } from '../../storage-adapters/SolareaViewId';
import { SolareaLinkData, SolareaViewData } from '../../storage-adapters/IStorageAdapter';
import { error, toast } from '../../utils/toast';
import { MenuItem } from './EditorMenu';
import { Tooltip } from './components/Tooltip';
import { UploadFile } from '../../components/FileUpload';
import { Icon } from '../../components/Icon';
import { Modal } from '../../components/Modal/Modal';
import { CodeUploaderWithPreview } from './CodeUploaderWithPreview';
import { styled } from './SolariaEditTheme';
import NewIcon from './components/Icon';

const SolareaLogo = () => (
  <svg
    className="solarea-logo"
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_473_198)">
      <path
        d="M18.0722 35.1758C27.5181 35.1758 35.1757 27.5182 35.1757 18.0722C35.1757 8.62607 27.5181 0.968445 18.0722 0.968445C8.62604 0.968445 0.968416 8.62607 0.968416 18.0722C0.968416 27.5182 8.62604 35.1758 18.0722 35.1758Z"
        fill="url(#paint0_radial_473_198)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M36.1173 18.0722C36.1173 27.997 27.997 36.1173 18.0722 36.1173C8.14736 36.1173 0.0270615 27.997 0.0270615 18.0722C0.0270615 8.14737 8.14736 0.0270681 18.0722 0.0270681C27.997 0.0270681 36.1173 8.14737 36.1173 18.0722ZM21.2301 11.215C15.6361 12.7489 10.8541 15.997 8.23759 13.1098C3.36541 7.69624 18.1624 -4.03308 29.1699 6.43308C30.7038 7.87669 33.5007 11.1248 34.0421 16.0872C34.0421 16.1774 33.8616 16.2677 33.8616 16.0872C32.6887 12.0271 27.997 9.3203 21.2301 11.215ZM14.9143 25.1098C20.5083 23.5759 25.2902 20.3278 27.9068 23.215C32.7789 28.6286 17.9819 40.3579 6.97443 29.8917C5.4406 28.4481 2.6436 25.2 2.10225 20.2376C2.10225 20.1474 2.2827 20.0571 2.2827 20.2376C3.45563 24.2977 8.14736 27.0045 14.9143 25.1098Z"
        fill="#112244"
      />
    </g>
    <defs>
      <radialGradient
        id="paint0_radial_473_198"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(27.1279 21.0239) scale(23.8421)"
      >
        <stop stop-color="#FFB300" />
        <stop offset="0.2399" stop-color="#FFB001" />
        <stop offset="0.3925" stop-color="#FFA806" />
        <stop offset="0.5207" stop-color="#FF990E" />
        <stop offset="0.6354" stop-color="#FF8419" />
        <stop offset="0.7411" stop-color="#FF6928" />
        <stop offset="0.8402" stop-color="#FF4839" />
        <stop offset="0.9324" stop-color="#FF214E" />
        <stop offset="1" stop-color="#FF0060" />
      </radialGradient>
      <clipPath id="clip0_473_198">
        <rect width="36" height="36" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const FileUploaderWithPreview = ({ saveFn, uploadToSolanaStarted }) => {
  const [file, setFile] = useEditorStore((state) => [state.file, state.setFile]);
  if (!file || !file.src) return null;
  return (
    <div>
      {file.binary && file.src && <UploadPreview binary={file.binary} src={file.src} />}
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
export const SolareaEditMenu = ({ id, name, onSelectTab, currentTab }) => {
  const {
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
  } = useEditorStore();

  const [uploadingToSolana, setUploadingToSolana] = useState(false);
  const [uploadToSolanaStarted, setUploadToSolanaStarted] = useState(false);

  const restStorage = useRestStorage();
  const solanaStorage = useSolanaStorage();

  const getSaveData = (data?: Buffer, type?: number) => {
    const linkId = link && link.includes('~') ? SolareaViewId.fromString(link) : undefined;

    const viewId = new SolareaViewId(id, name, selectedContext);
    const viewData = linkId
      ? new SolareaLinkData(viewId, linkId)
      : new SolareaViewData(
          viewId,
          type || mimeTypesData['solarea/jsx'],
          data || Buffer.from(editorValue),
        );

    return viewData;
  };

  const saveToMongo = async (data?: Buffer, type?: number) => {
    try {
      await restStorage.save(getSaveData(data, type));

      await loadInitialCode(solanaStorage, restStorage, id);
      toast('Successfully saved');
    } catch (err: any) {
      console.dir(err);
      error(`Cant save: ${err.message} ${err.code || ''}`);
    }
  };

  const saveToSolana = async (data?: Buffer, type?: number) => {
    try {
      setUploadingToSolana(true);
      setUploadToSolanaStarted(true);

      await solanaStorage.save(getSaveData(data, type)).finally(() => {
        setUploadingToSolana(false);
        setUploadToSolanaStarted(false);
      });

      await loadInitialCode(solanaStorage, restStorage, id);
    } catch (err) {
      return toast('Sorry, something went wrong', 5000, '#f1224b');
    }
  };

  const openView = () => {
    window.open(`/${id}/${name}`, '_blank');
  };

  return (
    <SolareaEditMenuContainer>
      <SolareaLogo />
      <div className="sol-edit-menu__list" style={{ zIndex: 10 }}>
        <Tooltip
          text="Editor"
          className={`sol-edit-menu__item ${
            currentTab === 'edit' ? 'sol-edit-menu__item_active' : ''
          }`}
          onClick={() => onSelectTab('edit')}
        >
          <NewIcon name="home" />
        </Tooltip>

        <Tooltip
          text="Graph QL"
          className={`sol-edit-menu__item ${
            currentTab === 'graphql' ? 'sol-edit-menu__item_active' : ''
          }`}
          onClick={() => onSelectTab('graphql')}
        >
          <Icon name="graphql" />
        </Tooltip>

        {/*<MenuItem*/}
        {/*  onClick={() => {*/}
        {/*    setCode(editorValue);*/}
        {/*  }}*/}
        {/*  icon="refresh"*/}
        {/*  title="Update preview"*/}
        {/*/>*/}
        {/*<MenuItem onClick={() => saveToMongo()} icon="save" title="Store" />*/}
        {/*<MenuItem onClick={() => saveToSolana()} icon="solana" title="Store onchain" />*/}

        <MenuItem onClick={openView} icon="play" title="Open view" />

        <Tooltip text="Upload file" className="sol-edit-menu__item">
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
    </SolareaEditMenuContainer>
  );
};

const SolareaEditMenuContainer = styled.div`
  background: ${(p) => p.theme.colors.fill.primary};
  width: 60px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;

  padding-bottom: 16px;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 4;

  .solarea-logo {
    margin: 14px 0 14px 0;
  }

  .sol-edit-menu__list {
    padding-top: 10px;
    //flex: 1;
    //overflow: hidden;
  }

  .sol-edit-menu__item {
    position: relative;
    display: block;
    width: 47px;

    margin-left: 13px;
    margin-bottom: 13px;
    padding: 8px 13px 8px 8px;
    box-sizing: border-box;

    border-radius: 6px 0 0 6px;
    border: none;

    line-height: 0;
    color: #e8e8e8;

    cursor: pointer;

    span {
      line-height: 1;
    }
    .custom-solarea-icon,
    svg {
      width: 20px;
      height: 20px;
    }
    &:hover {
      svg {
        color: #ffffff;
      }
    }

    &.sol-edit-menu__item_active {
      background: ${(p) => p.theme.colors.fill.secondary};

      &:before {
        position: absolute;
        content: '';
        right: 0;
        top: -20px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        box-shadow: 10px 10px 0 ${(p) => p.theme.colors.fill.secondary};
      }
      &:after {
        position: absolute;
        content: '';
        right: 0;
        bottom: -20px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        box-shadow: 10px -10px 0 ${(p) => p.theme.colors.fill.secondary};
      }
    }
  }

  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    &:first-child {
      margin-top: 10px;
    }
    + li {
      margin-top: 1rem;
    }
  }
`;
