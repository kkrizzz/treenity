import React from 'react';
import './GraphQLEditor.css';
import './editor.css';
import { GraphqlExplorer } from './components/GraphqlExplorer';
import { useQueryStore } from './store/queriesStore';
import QueryBuilder from './components/QueryBuilder';
import { getDefaultScalarArgValue, makeDefaultArg } from './components/QueryBuilder/CustomArgs';
import QueriesLibrary from './QueriesLibrary';

const GraphQLEditor = ({ addToComponent }) => {
  const { updateQuery, schema, setCurrentQuery, queries } = useQueryStore();
  const currentQuery = useQueryStore((state) => state.getCurrentQuery());

  if (!currentQuery)
    return (
      <div>
        <QueriesLibrary />
      </div>
    );

  return (
    <div className="GraphQLEditor">
      <div className="content flex" style={{ width: '100%' }}>
        <div className={'gallery flex flex-col active'} style={{ zIndex: 0 }}>
          <button style={{ margin: '0 4px 8px 4px' }} onClick={() => setCurrentQuery(null)}>
            ← Change query
          </button>
          <button style={{ margin: '0 4px 8px 4px' }} onClick={() => addToComponent(currentQuery)}>
            Add query to component
          </button>
          <QueryBuilder
            width={'300px'}
            minWidth={'300px'}
            title={'Builder'}
            schema={schema}
            query={currentQuery.query}
            onEdit={(query) => updateQuery({ query }, 0)}
            explorerIsOpen={true}
            getDefaultScalarArgValue={getDefaultScalarArgValue}
            makeDefaultArg={makeDefaultArg}
          />
        </div>

        <GraphqlExplorer />
      </div>
    </div>
  );
};

export default GraphQLEditor;
