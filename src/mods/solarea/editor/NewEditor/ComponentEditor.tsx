import React, { useEffect, useState } from 'react';

import useComponentQueries from './useComponentQueries';
import useEditorStore from '../../stores/editor-store';
import { useRestStorage, useSolanaStorage } from '../../storage-adapters/StorageProvider';
import { Snippets } from './Snippets';
import { Accordion } from './components/Accordion';
import Icon from './components/Icon';
import { deleteQueryFromComponent, editQueryFromComponent } from './graphql-editor/api';
import { error, toast } from '../../utils/toast';
import CodeMirror from '../CodeMirror';
import { css, styled } from './SolariaEditTheme';
import QueryEditor from './graphql-editor/QueryEditor';
import { useQueryStore } from './graphql-editor/store/queriesStore';
import { SolareaEditPreview } from './Preview';
import { SolareaViewId } from '../../storage-adapters/SolareaViewId';
import { SolareaLinkData, SolareaViewData } from '../../storage-adapters/IStorageAdapter';
import { mimeTypesData } from '../../utils/mime-types-data';

const ComponentEditor = ({ viewId, params }) => {
  const { setCurrentQuery } = useQueryStore();
  const [showQueryEditor, setShowQueryEditor] = useState(false);
  const openEditor = (query: any) => {
    setCurrentQuery(query);
    setShowQueryEditor(true);
  };
  const closeEditor = () => {
    setCurrentQuery(null);
    setShowQueryEditor(false);
  };
  const saveQuery = async (query: any) => {
    const response = await editQueryFromComponent(query._id, query).then();
    if (response.ok) {
      closeEditor();
      refetchComponentQueries();
      toast('Query was saved');
    } else {
      toast('error', 3000, 'red');
    }
  };

  const { componentQueries, refetch: refetchComponentQueries } = useComponentQueries(viewId);

  const {
    setEditorValue,
    editorMaxWidth,
    initialCode,
    loadInitialCode,
    link,
    editorValue,
  } = useEditorStore();
  const solanaStorage = useSolanaStorage();
  const restStorage = useRestStorage();

  const getSaveData = (data?: Buffer, type?: number) => {
    const linkId = link && link.includes('~') ? SolareaViewId.fromString(link) : undefined;

    return linkId
      ? new SolareaLinkData(viewId, linkId)
      : new SolareaViewData(
          viewId,
          type || mimeTypesData['solarea/jsx'],
          data || Buffer.from(editorValue),
        );
  };

  const saveToMongo = async (data?: Buffer, type?: number) => {
    try {
      await restStorage.save(getSaveData(data, type));

      await loadInitialCode(solanaStorage, restStorage, viewId.id);
      toast('Successfully saved');
    } catch (err: any) {
      console.dir(err);
      error(`Cant save: ${err.message} ${err.code || ''}`);
    }
  };

  const saveToSolana = async (data?: Buffer, type?: number) => {
    try {
      await solanaStorage.save(getSaveData(data, type));

      await loadInitialCode(solanaStorage, restStorage, viewId.id);
    } catch (err) {
      return toast('Sorry, something went wrong', 5000, '#f1224b');
    }
  };

  useEffect(() => {
    loadInitialCode(solanaStorage, restStorage, viewId);
  }, []);

  if (showQueryEditor)
    return <QueryEditor onSaveText={'Save'} onSave={saveQuery} onClose={closeEditor} />;

  return (
    <>
      <Snippets>
        <Accordion title="Queries">
          {componentQueries.map((query) => (
            <QuerySnippet>
              <Icon name="query" />
              <span>{query.name}</span>

              <div>
                <button onClick={() => openEditor(query)} className="query-snippet__settings-btn">
                  <Icon name="gear" />
                </button>
                <button
                  className="query-snippet__delete-btn"
                  onClick={() =>
                    deleteQueryFromComponent(query._id).then((r) => {
                      r.ok ? toast('Query was removed') : toast('Error', 3000, 'red');
                      refetchComponentQueries();
                    })
                  }
                >
                  <Icon name="cross" />
                </button>
              </div>
            </QuerySnippet>
          ))}
        </Accordion>
      </Snippets>
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
          onSave={saveToMongo}
          onSaveToBC={saveToSolana}
        />
      </div>
      <SolareaEditPreview id={viewId.address} name={viewId.name} {...params} />
    </>
  );
};

const QuerySnippet = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    color: ${theme.colors.text.secondary};

    & > svg {
      width: 14px;
      height: 14px;
      margin-right: 8px;
    }
    & > div {
      margin-left: auto;
      display: flex;
      & > button {
        cursor: pointer;
        border: none;
        background: transparent;
        padding: 0;
        color: ${theme.colors.text.secondary};

        &:hover {
          color: ${theme.colors.text.secondaryLight};
        }
      }
    }
  `,
);

export default ComponentEditor;
