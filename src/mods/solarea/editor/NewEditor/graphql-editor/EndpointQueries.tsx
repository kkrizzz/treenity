import React, { FC } from 'react';
import { Endpoint } from './hooks/useEndpoints';
import { useEndpointQueries } from './hooks/useEndpointQueries';
import QueryCard from '../components/QueryCard';
import { styled, css } from '../SolariaEditTheme';
import { useQueryStore } from './store/queriesStore';

interface EndpointQueriesProps {
  endpoint: Endpoint;
  onChooseQuery: (query: any) => unknown;
}

const EndpointQueries: FC<EndpointQueriesProps> = ({ endpoint, onChooseQuery, children }) => {
  const { queries } = useEndpointQueries(endpoint._id);

  return (
    <EndpointQueriesContainer>
      <div className="endpoint-queries__title">Queries</div>
      {queries.map((query) => (
        <QueryCard key={query._id} name={query.name} onClick={() => onChooseQuery(query)} />
      ))}

      {children}
    </EndpointQueriesContainer>
  );
};

const EndpointQueriesContainer = styled.div`
  margin-right: 8px;
  .endpoint-queries__title {
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 14px;
    color: ${(p) => p.theme.colors.text.primary};
    margin-top: 16px;
    margin-bottom: 14px;
  }

  & > .editor__back-btn {
    width: 100% !important;
  }
  & > div {
    margin-top: 8px;
  }
`;

export default EndpointQueries;
