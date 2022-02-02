import React, { useEffect, useState } from 'react';
import CodeMirror from '../CodeMirror';
import './SolareaEdit.scss';

import useEditorStore from '../../stores/editor-store';
import { Snippets } from './Snippets';
import { SolareaViewId } from '../../storage-adapters/SolareaViewId';
import { useRestStorage, useSolanaStorage } from '../../storage-adapters/StorageProvider';
import GraphQLEditor from './graphql-editor/GraphQLEditor';
import useComponentQueries from './useComponentQueries';
import { SolareaEditMenu } from './SolareaEditMenu';
import { EditorWidthController } from './EditorWidthController';
import { SolariaEditThemeProvider, styled } from './SolariaEditTheme';

const SolareaEdit = ({ value, id, name, context, ...params }) => {
  const viewId = new SolareaViewId(id, name, context);
  const { componentQueries, add } = useComponentQueries(viewId);

  const [setEditorValue, editorMaxWidth, initialCode, loadInitialCode] = useEditorStore((state) => [
    state.setEditorValue,
    state.editorMaxWidth,
    state.initialCode,
    state.loadInitialCode,
  ]);

  const [currentTab, setCurrentTab] = useState('edit');

  const solanaStorage = useSolanaStorage();
  const restStorage = useRestStorage();

  useEffect(() => {
    loadInitialCode(solanaStorage, restStorage, viewId);
  }, []);

  const tabs = {
    edit: (
      <>
        <Snippets />
        <div
          style={{
            maxWidth: editorMaxWidth,
            width: '100%',
            transition: 'max-width 0.5s ease-in-out',
            // backgroundColor: '#282c33',
            height: '100%',
          }}
        >
          <CodeMirror
            value={initialCode}
            onChange={(value) => {
              setEditorValue(value);
            }}
          />
        </div>
        {/*<EditorWidthController />*/}
        {/*<SolareaEditPreview id={id} value={value} name={name} {...params} />*/}
      </>
    ),
    graphql: <GraphQLEditor addToComponent={add} />,
  };

  return (
    <SolariaEditThemeProvider>
      <SolareaEditContainer>
        <SolareaEditMenu
          id={id}
          name={name}
          onSelectTab={(newTab) => setCurrentTab(newTab)}
          currentTab={currentTab}
        />

        <h1>{currentTab === 'edit' ? 'Editor' : 'URLs'}</h1>
        <div className="sol-edit__content">{tabs[currentTab] || 'none'}</div>
      </SolareaEditContainer>
    </SolariaEditThemeProvider>
  );
};

const SolareaEditContainer = styled.div`
  background: ${(p) => p.theme.colors.fill.primary};
  padding-left: 60px;

  h1 {
    margin: 0;
    padding: 14px 10px;
    color: ${(p) => p.theme.colors.text.primary};
    font-family: Inter;
    font-style: normal;
    font-weight: 900;
    font-size: 12px;
    line-height: 12px;
    text-transform: uppercase;
  }

  .sol-edit__content {
    padding-left: 14px;
    border-radius: 10px 0 0 0;
    background: ${(p) => p.theme.colors.fill.secondary};
    display: flex;
    align-items: stretch;
    height: calc(100vh - 40px);
  }
`;

export default SolareaEdit;
