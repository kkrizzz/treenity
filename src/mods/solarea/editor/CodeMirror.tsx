import React, { useLayoutEffect, useRef } from 'react';
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';

import './CodeMirror.css';
import { styled } from './NewEditor/SolariaEditTheme';
import Icon from './NewEditor/components/Icon';

// import './codemirror-addons/keyword';

export default function CodeMirror({ value, onChange, onSave /*, onSaveToBC*/ }) {
  const container = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView>();

  useLayoutEffect(() => {
    const editor = (view.current = new EditorView({
      state: EditorState.create({
        extensions: [
          basicSetup,
          oneDark,
          EditorView.updateListener.of((viewUpdate) => {
            if (viewUpdate.docChanged) {
              onChange(viewUpdate.state.doc.toString());
            }
          }),
          keymap.of([...defaultKeymap, indentWithTab]),
          javascript({ jsx: true, typescript: false }),
        ],
      }),

      parent: container.current!,
    }));
    if (value) {
      editor.state;
      editor.dispatch({
        changes: {
          from: 0,
          to: editor?.state.doc.length,
          insert: value,
        },
      });
    }
  }, []);
  useLayoutEffect(() => {
    const editor = view.current;
    editor?.dispatch({ changes: { from: 0, to: editor?.state.doc.length, insert: value } });
  }, [value]);

  return (
    <CodeEditorContainer>
      <div className="code-editor__toolbar">
        <div>
          <span>
            <Icon name="addFile" />
          </span>
          <span>
            <Icon name="addFolder" />
          </span>
          <span onClick={onSave}>
            <Icon name="save" />
          </span>
          <span onClick={onSave}>
            <Icon name="saveToSolana" />
          </span>
        </div>
        <div>
          <Icon name="share" />
          <Icon name="terminal" />
          <Icon name="maximize" />
        </div>
      </div>
      <div className="code-editor__editor" ref={container} />
    </CodeEditorContainer>
  );
}

const CodeEditorContainer = styled.div`
  height: 100%;
  border-left: 1px solid;
  border-right: 1px solid;
  border-color: ${(p) => p.theme.colors.text.primary + '1a'};
  box-sizing: border-box;

  .code-editor__toolbar {
    padding-left: 24px;
    padding-right: 8px;
    color: ${(p) => p.theme.colors.text.primary};
    height: 32px;
    width: 100%;
    background: ${(p) => p.theme.colors.fill.secondary};
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${(p) => p.theme.colors.text.primary + '1a'};
    box-sizing: border-box;

    span {
      display: flex;
    }
    svg {
      line-height: 0;
      opacity: 0.25;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }

    & > div {
      display: flex;
      align-items: center;
    }

    & > div:first-child > * {
      margin-right: 4px;
    }

    & > div:last-child > * {
      margin-left: 4px;
    }
  }

  .code-editor__editor {
    padding-left: 16px;
    display: flex;
    width: calc(100% - 16px);
    height: calc(100% - 32px);
    background: ${(p) => p.theme.colors.fill.secondaryDark};

    .cm-editor {
      background: transparent;
      width: calc(100% - 8px);

      .cm-activeLine,
      .cm-activeLineGutter {
        background: ${(p) => p.theme.colors.fill.secondaryLight};
      }
    }

    .cm-scroller {
      margin-top: 8px;

      & > * {
        color: ${(p) => p.theme.colors.text.primary + '40'};
        background: transparent;
        font-family: monospace;
      }
    }
  }
`;
