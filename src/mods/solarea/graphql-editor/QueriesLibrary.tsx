import React, { useState } from 'react';
import './GraphQLEditor.css';
import './editor.css';
import { Endpoint, useEndpoints } from './hooks/useEndpoints';
import { useQueriesGallery } from './hooks/useQueriesGallery';
import styled from 'styled-components';
import { useQueryStore } from './store/queriesStore';

const QueriesLibrary = () => {
  const { setQueries, setCurrentQuery } = useQueryStore();
  const { endpoints, isEndpointsLoading } = useEndpoints();
  const [currentEndpoint, setCurrentEndpoint] = useState<Endpoint | null>(null);
  const { queries, isQueriesLoading } = useQueriesGallery(currentEndpoint?._id);

  return (
    <QueriesLibraryContainer>
      <div className="queries-library-container__endpoints">
        <h2>Endpoints</h2>

        {isEndpointsLoading
          ? 'Loading'
          : endpoints?.map((endpoint) => (
              <div
                className={currentEndpoint?._id === endpoint._id ? 'active' : ''}
                onClick={() => setCurrentEndpoint(endpoint)}
              >
                {endpoint.name}

                <p>{endpoint.description}</p>
              </div>
            ))}
      </div>
      <div
        className="queries-library-container__endpoints"
        style={{ marginLeft: 8, border: 'none' }}
      >
        <h2>Queries</h2>
        {!currentEndpoint ? (
          'Choose endpoint'
        ) : isQueriesLoading ? (
          'Loading'
        ) : (
          <>
            {queries.map((query) => (
              <div
                // className={currentEndpoint?._id === endpoint._id ? 'active' : ''}
                onClick={() => {
                  setQueries([{ ...query, endpoint_url: currentEndpoint.url }]);
                  setCurrentQuery(query._id);
                }}
              >
                {query.name}

                <p>{query.description}</p>
              </div>
            ))}

            <div
              onClick={() => {
                setQueries([
                  {
                    _id: '1',
                    query: '',
                    variables: '{}',
                    endpoint_url: currentEndpoint.url,
                    name: 'newQuery',
                  },
                ]);
                setCurrentQuery('1');
              }}
            >
              Blank Query
              <p>Try endpoint from the blank query</p>
            </div>
          </>
        )}
      </div>
    </QueriesLibraryContainer>
  );
};

const QueriesLibraryContainer = styled.div`
  display: flex;
  width: calc(100vw - 60px);
  height: calc(100vh - 16px);

  * {
    color: white;
  }
  background: #292d3e;

  .queries-library-container__endpoints {
    border-right: 1px solid rgb(53, 58, 81);
    width: 300px;
    height: 100%;
    display: grid;
    grid-auto-rows: min-content;
    grid-row-gap: 4px;

    & > h2 {
      padding-left: 8px;
    }

    & > div {
      cursor: pointer;
      padding: 8px;
      background: #474c5e;
    }

    & > div:hover {
      background: #585e75;
    }

    & > div.active {
      background: #585e75;
    }

    & > div > p {
      color: #9aa5ce;
      font-size: small;
    }
  }
`;

export default QueriesLibrary;
