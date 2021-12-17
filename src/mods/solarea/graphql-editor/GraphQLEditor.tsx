import React from 'react';
import './GraphQLEditor.css';
import './editor.css';
import { GraphqlExplorer } from './components/GraphqlExplorer';
import { useQueryStore } from './store/queriesStore';
import QueryBuilder from './components/QueryBuilder';
import { getDefaultScalarArgValue, makeDefaultArg } from './components/QueryBuilder/CustomArgs';

const GraphQLEditor = () => {
  const { updateQuery, schema, setCurrentQuery, queries } = useQueryStore();
  const currentQuery = useQueryStore((state) => state.getCurrentQuery());

  return (
    <div className="GraphQLEditor">
      <div className="content flex" style={{ width: '100%' }}>
        <div className={'gallery flex flex-col active'} style={{ zIndex: 0 }}>
          {currentQuery ? (
            <>
              <button style={{ margin: '0 4px 8px 4px' }} onClick={() => setCurrentQuery(null)}>
                ← Change query
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
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 8px' }}>
              <h2>Queries</h2>
              {queries.map((q) => (
                <button onClick={() => setCurrentQuery(q.name)} style={{ marginBottom: 4 }}>
                  {q.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {currentQuery ? (
          <GraphqlExplorer />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Choose query
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphQLEditor;
