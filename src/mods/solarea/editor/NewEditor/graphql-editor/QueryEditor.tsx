import { EditorContainer } from './EditorContainer';
import Icon from '../components/Icon';
import QueryBuilder from './components/QueryBuilder';
import { getDefaultScalarArgValue, makeDefaultArg } from './components/QueryBuilder/CustomArgs';
import { GraphqlExplorer } from './components/GraphqlExplorer';
import React, { FC, useState } from 'react';
import { useQueryStore } from './store/queriesStore';
import { Endpoint } from './hooks/useEndpoints';
import IComponentQuery from '../types/IComponentQuery';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import camelize from './utils/camelize';

interface QueryEditorProps {
  onSaveText: string;
  onSave: (query: IComponentQuery) => unknown;
  onClose: () => unknown;
  nameEditable?: boolean;

  endpoint?: Endpoint;
}

const QueryEditor: FC<QueryEditorProps> = ({
  endpoint,
  onSave,
  onSaveText,
  onClose,
  nameEditable = false,
}) => {
  const { updateCurrentQuery, schema, currentQuery } = useQueryStore();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [queryName, setQueryName] = useState(camelize(currentQuery.name));

  return (
    <EditorContainer className="GraphQLEditor">
      <div className="editor__current-endpoint">{endpoint?.url || currentQuery.endpointURL}</div>
      <div className="content flex" style={{ width: '100%' }}>
        <div className={'gallery flex flex-col active'} style={{ zIndex: 0, position: 'relative' }}>
          <div className="editor__builder-head">
            <button onClick={onClose}>
              <Icon name="chevronLeft" />
            </button>
            {currentQuery.name}
          </div>
          <QueryBuilder
            width={'300px'}
            minWidth={'300px'}
            title={'Builder'}
            schema={schema}
            query={currentQuery.query}
            onEdit={(query) => updateCurrentQuery({ query }, 0)}
            explorerIsOpen={true}
            getDefaultScalarArgValue={getDefaultScalarArgValue}
            makeDefaultArg={makeDefaultArg}
          />

          <button
            className="editor__save-btn"
            onClick={() => (nameEditable ? setShowSaveModal(true) : onSave(currentQuery))}
          >
            {onSaveText}
          </button>
        </div>

        <GraphqlExplorer />
      </div>

      <Modal isVisible={showSaveModal} onClose={() => setShowSaveModal(false)}>
        <h2>Set query name</h2>
        <Input
          label={'Name'}
          value={queryName}
          onChange={(event) => setQueryName(event.target.value)}
        />

        <div style={{ display: 'flex' }}>
          <Button
            style={{ marginLeft: 'auto', marginTop: 12 }}
            onClick={() => {
              onSave({ ...currentQuery, name: queryName });
              setShowSaveModal(false);
            }}
          >
            Create
          </Button>
        </div>
      </Modal>
    </EditorContainer>
  );
};

export default QueryEditor;
