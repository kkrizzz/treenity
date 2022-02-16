import React, { FC } from 'react';
import { Endpoint } from './hooks/useEndpoints';
import { useEndpointQueries } from './hooks/useEndpointQueries';
import QueryCard from '../components/QueryCard';
import { css, styled } from '../SolariaEditTheme';
import { EditorContainer } from './EditorContainer';
import Icon from '../components/Icon';

interface EndpointQueriesProps {
  endpoint: Endpoint;
  onChooseQuery: (query: any) => unknown;
  onBack: () => unknown;
}

const EndpointQueries: FC<EndpointQueriesProps> = ({ endpoint, onChooseQuery, onBack }) => {
  const { queries } = useEndpointQueries(endpoint._id);

  return (
    <EditorContainer className="GraphQLEditor">
      <div className="editor__current-endpoint">{endpoint.url}</div>

      <div className="content flex" style={{ width: '100%' }}>
        <div className={'gallery flex flex-col active'} style={{ zIndex: 0 }}>
          <EndpointQueriesContainer>
            <div className="editor__builder-head" onClick={onBack}>
              <button>
                <Icon name="chevronLeft" />
              </button>
              Queries
            </div>
            {queries.map((query) => (
              <QueryCard key={query._id} name={query.name} onClick={() => onChooseQuery(query)} />
            ))}
          </EndpointQueriesContainer>
        </div>

        <EmptyEditor>
          <div>
            {[...Array(41).keys()].map((key) => (
              <div>{key + 1}</div>
            ))}
          </div>
        </EmptyEditor>
      </div>
    </EditorContainer>
  );
};

const EmptyEditor = styled.div(
  ({ theme }) => css`
    margin-top: -5px;

    & > div {
      font-family: monospace;
      color: ${theme.colors.text.primary}40;
      text-align: right;
      border-left: 1px solid ${theme.colors.fill.secondaryLight};

      height: 100%;
      padding-top: 10px;

      & > div {
        padding-left: 16px;
      }
    }
  `,
);

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
