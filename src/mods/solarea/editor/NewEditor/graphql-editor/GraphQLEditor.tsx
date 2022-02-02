import React, { useState } from 'react';
import './GraphQLEditor.css';
import './editor.css';
import { GraphqlExplorer } from './components/GraphqlExplorer';
import { useQueryStore } from './store/queriesStore';
import QueryBuilder from './components/QueryBuilder';
import { getDefaultScalarArgValue, makeDefaultArg } from './components/QueryBuilder/CustomArgs';
import EndpointsLibrary from './EndpointsLibrary';
import EndpointCard from '../components/EndpointCard';
import { styled } from '../SolariaEditTheme';
import { css } from 'styled-components';
import { Endpoint } from './hooks/useEndpoints';
import EndpointQueries from './EndpointQueries';

const GraphQLEditor = ({ addToComponent }) => {
  const { updateQuery, schema, setCurrentQuery, currentQueryID, setQueries } = useQueryStore();
  const currentQuery = useQueryStore((state) => state.getCurrentQuery());
  const [currentEndpoint, setCurrentEndpoint] = useState<Endpoint | null>(null);

  if (!currentEndpoint)
    return (
      <div>
        <EndpointsLibrary onChooseEndpoint={setCurrentEndpoint} />
      </div>
    );

  if (!currentQueryID)
    return (
      <EditorContainer className="GraphQLEditor">
        <div className="content flex" style={{ width: '100%' }}>
          <div className={'gallery flex flex-col active'} style={{ zIndex: 0 }}>
            <EndpointQueries
              endpoint={currentEndpoint}
              onChooseQuery={(query) => {
                setQueries([{ ...query, endpoint_url: currentEndpoint.url }]);
                setCurrentQuery(query._id);
              }}
            >
              <button className="editor__back-btn" onClick={() => setCurrentEndpoint(null)}>
                ← Change URL
              </button>
            </EndpointQueries>
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

  return (
    <EditorContainer className="GraphQLEditor">
      <div className="content flex" style={{ width: '100%' }}>
        <div className={'gallery flex flex-col active'} style={{ zIndex: 0 }}>
          <button className="editor__back-btn" onClick={() => setCurrentQuery(null)}>
            ← Change query
          </button>
          {/*<button style={{ margin: '0 4px 8px 4px' }} onClick={() => addToComponent(currentQuery)}>*/}
          {/*  Add query to component*/}
          {/*</button>*/}
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
const EditorContainer = styled.div(
  ({ theme }) => css`
    padding-top: 0 !important;
    .doc-explorer-contents {
      padding-left: 0 !important;
    }

    .editor__back-btn {
      box-sizing: border-box;
      display: flex;
      font-family: Inter;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 14px;
      background: ${theme.colors.fill.secondaryLight};
      color: ${theme.colors.text.primary};
      width: calc(100% - 14px);
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      padding: 15px 10px;
      outline: none;
      border: none;
      margin-top: 16px;
    }
    .error-container {
      color: ${theme.colors.text.primary};
    }
    .sizeChanger,
    .workspace__wrapper {
      border-color: ${theme.colors.fill.secondaryLight} !important;
    }
    .graphiql__wrapper {
      // padding-left: 8px;
      // border-left: 1px solid ${theme.colors.fill.secondaryLight};
    }

    .CodeMirror-gutters {
      background-color: ${theme.colors.fill.secondaryLight} !important;
      border-color: ${theme.colors.fill.secondaryLight} !important;
    }
  `,
);

export default GraphQLEditor;
