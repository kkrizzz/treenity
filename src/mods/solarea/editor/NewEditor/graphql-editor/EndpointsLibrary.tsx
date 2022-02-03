import React, { useState } from 'react';
import './GraphQLEditor.css';
import './editor.css';
import { Endpoint, useEndpoints } from './hooks/useEndpoints';
import { useEndpointQueries } from './hooks/useEndpointQueries';
import styled, { css } from 'styled-components';
import { useQueryStore } from './store/queriesStore';
import EndpointCard from '../components/EndpointCard';

const EndpointsLibrary = ({ onChooseEndpoint }) => {
  const { endpoints, isEndpointsLoading } = useEndpoints();
  const [currentEndpoint, setCurrentEndpoint] = useState<Endpoint | null>(null);
  const { queries, isQueriesLoading } = useEndpointQueries(currentEndpoint?._id);

  return (
    <EndpointsGalleryContainer>
      <h2>last viewed</h2>
      <div className="endpoints-gallery__endpoints">
        {isEndpointsLoading
          ? 'Loading'
          : endpoints?.map((endpoint) => (
              <EndpointCard
                title={endpoint.url.split('/')[2]}
                name={endpoint.name}
                description={endpoint.description}
                onClick={() => {
                  console.log(endpoint);
                  onChooseEndpoint && onChooseEndpoint(endpoint);
                }}
              />
            ))}
      </div>
    </EndpointsGalleryContainer>
  );

  // return (
  //   <QueriesLibraryContainer>
  //     <div className="queries-library-container__endpoints">
  //       <h2>Endpoints</h2>
  //
  //       {isEndpointsLoading
  //         ? 'Loading'
  //         : endpoints?.map((endpoint) => (
  //             <div
  //               className={currentEndpoint?._id === endpoint._id ? 'active' : ''}
  //               onClick={() => setCurrentEndpoint(endpoint)}
  //             >
  //               {endpoint.name}
  //
  //               <p>{endpoint.description}</p>
  //             </div>
  //           ))}
  //     </div>
  //     <div
  //       className="queries-library-container__endpoints"
  //       style={{ marginLeft: 8, border: 'none' }}
  //     >
  //       <h2>Queries</h2>
  //       {!currentEndpoint ? (
  //         'Choose endpoint'
  //       ) : isQueriesLoading ? (
  //         'Loading'
  //       ) : (
  //         <>
  //           {queries.map((query) => (
  //             <div
  //               // className={currentEndpoint?._id === endpoint._id ? 'active' : ''}
  //               onClick={() => {
  //                 setQueries([{ ...query, endpoint_url: currentEndpoint.url }]);
  //                 setCurrentQuery(query._id);
  //               }}
  //             >
  //               {query.name}
  //
  //               <p>{query.description}</p>
  //             </div>
  //           ))}
  //
  //           <div
  //             onClick={() => {
  //               setQueries([
  //                 {
  //                   _id: '1',
  //                   query: '',
  //                   variables: '{}',
  //                   endpoint_url: currentEndpoint.url,
  //                   name: 'newQuery',
  //                 },
  //               ]);
  //               setCurrentQuery('1');
  //             }}
  //           >
  //             Blank Query
  //             <p>Try endpoint from the blank query</p>
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   </QueriesLibraryContainer>
  // );
};

const EndpointsGalleryContainer = styled.div(
  (p) => css`
    padding: 20px 20px 20px 6px;

    h2 {
      font-family: Inter;
      font-style: normal;
      font-weight: 900;
      font-size: 12px;
      line-height: 12px;
      text-transform: uppercase;
      color: ${p.theme.colors.text.primary};
      margin-bottom: 16px;
      margin-top: 0;
    }

    .endpoints-gallery__endpoints {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-row-gap: 20px;
      grid-column-gap: 20px;
    }
  `,
);

const QueriesLibraryContainer = styled.div`
  display: flex;
  width: calc(100vw - 60px);
  height: calc(100vh - 16px);

  * {
    color: white;
  }
  //background: #292d3e;

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

export default EndpointsLibrary;
