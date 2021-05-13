import React, { useState } from 'react';
import CodeMirror from '../CodeMirror';
import { DeviceScaleFrame } from '../DeviceScaleFrame';
import { Preview } from '../Preview';
import { Icon } from '../../components/Icon';
import './SolareaEdit.scss';
import { MenuItem } from './EditorMenu';
import { UploadFile } from '../../components/FileUpload';
import { Tooltip } from './Tooltip';

import useEditorStore from '../../stores/editor-store';
import { Accordion, AccordionTab } from '../../components/Accordion';

const EditorWidthController = () => {
  const [editorMaxWidth, setEditorMaxWidth] = useEditorStore((state) => [
    state.editorMaxWidth,
    state.setEditorMaxWidth,
  ]);
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

const Snippets = () => {
  return (
    <div className="snippets-markup">
      <Accordion title="view">
        <div>Context: </div>
        <div>Link: </div>
      </Accordion>
      <Accordion title="config">
        <div>Context: </div>
        <div>Link: </div>
      </Accordion>
    </div>
  );
};

const SolareaEditMenu = () => {
  const [setCode, editorValue] = useEditorStore((state) => [state.setCode, state.editorValue]);
  return (
    <div className="sol-menu-markup">
      <div className="sol-menu-markup-list">
        <MenuItem
          onClick={() => {
            console.log('qwe');
            setCode(editorValue);
          }}
          icon="refresh"
          title="Update preview"
        />
        <MenuItem onClick={() => setCode(editorValue)} icon="save" title="Store" />
        <MenuItem onClick={() => setCode(editorValue)} icon="solana" title="Store onchain" />
        <MenuItem onClick={() => setCode(editorValue)} icon="rewind" title="Reset draft" />
        <MenuItem onClick={() => setCode(editorValue)} icon="play" title="Open view" />
        <Tooltip text="Upload file" className="sol-menu-item">
          <UploadFile
            onChangeFile={(file, formatted) => {
              console.log('qwe');
            }}
            returnFormat="binary"
          >
            <Icon name="upload" />
          </UploadFile>
        </Tooltip>
      </div>
    </div>
  );
};

const SolareaEditPreview = ({ value, id, name, context, ...params }) => {
  const code = useEditorStore((state) => state.code);
  return (
    <div className="sol-markup-preview">
      <DeviceScaleFrame>
        {code && (
          <Preview
            {...params}
            key={code}
            accountData={value}
            code={code}
            id={id}
            name={name}
            context={context}
          />
        )}
      </DeviceScaleFrame>
    </div>
  );
};

export const SolareaEdit = ({ value, id, name, context, ...params }) => {
  const [setEditorValue, editorMaxWidth] = useEditorStore((state) => [
    state.setEditorValue,
    state.editorMaxWidth,
  ]);
  const [initialCode, setInitialCode] = useState('');

  return (
    <div className="sol-markup-wr">
      <SolareaEditMenu />
      <Snippets />

      <div
        style={{
          maxWidth: editorMaxWidth,
          width: '100%',
          transition: 'max-width 0.5s ease-in-out',
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
      <SolareaEditPreview id={id} value={value} name={name} context={context} {...params} />
    </div>
  );
};
