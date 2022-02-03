import React, { useState } from 'react';
import './GraphQLEditor.css';
import './editor.css';
import { GraphqlExplorer } from './components/GraphqlExplorer';
import { useQueryStore } from './store/queriesStore';
import QueryBuilder from './components/QueryBuilder';
import { getDefaultScalarArgValue, makeDefaultArg } from './components/QueryBuilder/CustomArgs';
import EndpointsLibrary from './EndpointsLibrary';
import EndpointCard from '../components/EndpointCard';
import { styled, css } from '../SolariaEditTheme';
import { Endpoint } from './hooks/useEndpoints';
import EndpointQueries from './EndpointQueries';
import Icon from '../components/Icon';
import { toast } from '../../../utils/toast';

const GraphQLEditor = ({ addToComponent }) => {
  const { updateCurrentQuery, schema, setCurrentQuery, currentQuery } = useQueryStore();
  const [currentEndpoint, setCurrentEndpoint] = useState<Endpoint | null>(null);

  if (!currentEndpoint)
    return (
      <div>
        <EndpointsLibrary onChooseEndpoint={setCurrentEndpoint} />
      </div>
    );

  if (currentQuery == null)
    return (
      <EditorContainer className="GraphQLEditor">
        <div className="editor__current-endpoint">{currentEndpoint.url}</div>

        <div className="content flex" style={{ width: '100%' }}>
          <div className={'gallery flex flex-col active'} style={{ zIndex: 0 }}>
            <EndpointQueries
              endpoint={currentEndpoint}
              onChooseQuery={(query) => {
                setCurrentQuery({ ...query, endpoint_url: currentEndpoint.url });
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
      <div className="editor__current-endpoint">{currentEndpoint.url}</div>
      <div className="content flex" style={{ width: '100%' }}>
        <div className={'gallery flex flex-col active'} style={{ zIndex: 0, position: 'relative' }}>
          <div className="editor__builder-head">
            <button onClick={() => setCurrentQuery(null)}>
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
            onClick={() => {
              addToComponent(currentQuery).then(() => {
                toast('Query was added to component workspace');
              });
            }}
          >
            Add to my workspace
          </button>
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
    height: calc(100vh - 40px);
    position: relative;
    overflow: visible !important;
    padding-top: 0 !important;

    .editor__current-endpoint {
      position: absolute;
      left: 300px;
      top: -20px;
      font-size: 10px;
      line-height: 10px;
      color: ${theme.colors.text.secondary};
    }
    .doc-explorer-contents {
      padding-left: 0 !important;
    }
    .docExplorerWrap {
      height: calc(100% - 140px) !important;
    }

    .editor__builder-head {
      display: flex;
      align-items: center;
      background: ${theme.colors.fill.gradientTransparent};
      width: calc(100% - 14px);
      height: 44px;
      margin-top: 16px;
      border-radius: 4px;
      color: ${theme.colors.text.primary};
      button {
        width: 30px;
        height: 30px;
        background: rgba(241, 241, 241, 0.25);
        border-radius: 2px;
        border: none;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin: 0 8px 0 10px;
      }
    }
    .editor__save-btn {
      width: 234px;
      padding: 16px 32px;
      border-radius: 16px;
      background: ${theme.colors.fill.gradient};
      margin: auto auto 10px auto;
      border: none;
      cursor: pointer;

      font-family: Inter;
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 16px;
      color: ${theme.colors.text.primary};
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
    .over-wrapper {
      height: 100% !important;
    }

    .CodeMirror-gutters {
      background-color: ${theme.colors.fill.secondaryLight} !important;
      border-color: ${theme.colors.fill.secondaryLight} !important;
    }
  `,
);

export default GraphQLEditor;
