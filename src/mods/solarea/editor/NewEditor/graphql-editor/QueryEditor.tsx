import { EditorContainer } from './EditorContainer';
import Icon from '../components/Icon';
import QueryBuilder from './components/QueryBuilder';
import { getDefaultScalarArgValue, makeDefaultArg } from './components/QueryBuilder/CustomArgs';
import { addQueryToComponent } from './api';
import { toast } from '../../../utils/toast';
import { GraphqlExplorer } from './components/GraphqlExplorer';
import React, { FC } from 'react';
import { useQueryStore } from './store/queriesStore';
import { Endpoint } from './hooks/useEndpoints';
import IComponentQuery from '../types/IComponentQuery';

interface QueryEditorProps {
  onSaveText: string;
  onSave: (query: IComponentQuery) => unknown;
  onClose: () => unknown;

  endpoint?: Endpoint;
}

const QueryEditor: FC<QueryEditorProps> = ({ endpoint, onSave, onSaveText, onClose }) => {
  const { updateCurrentQuery, schema, currentQuery } = useQueryStore();

  return (
    <EditorContainer className="GraphQLEditor">
      <div className="editor__current-endpoint">{endpoint?.url || currentQuery.endpoint_url}</div>
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

          <button className="editor__save-btn" onClick={() => onSave(currentQuery)}>
            {onSaveText}
          </button>
        </div>

        <GraphqlExplorer />
      </div>
    </EditorContainer>
  );
};

export default QueryEditor;
