import { css, styled } from '../SolariaEditTheme';
import './GraphQLEditor.css';
import './editor.css';

export const EditorContainer = styled.div(
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
