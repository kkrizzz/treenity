import React, { useLayoutEffect, useRef } from 'react';
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { defaultTabBinding } from '@codemirror/commands';

import './CodeMirror.css';

// import './codemirror-addons/keyword';

export default function CodeMirror({ value, onChange }) {
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
          keymap.of([defaultTabBinding]),
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
          to: Number.MAX_SAFE_INTEGER,
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
    <div
      className="solarea-editor"
      style={{ display: 'flex', height: '100vh', width: '100%' }}
      ref={container}
    />
  );
}

// export function CodeMirrorComponent({ value }) {
//   return (
//     <CodeMirror
//       {...renderPreviewLongPress}
//       value={value}
//       options={{
//         resetSelectionOnContextMenu: false,
//         readOnly: !!link,
//         tabSize: 2,
//         autoCloseTags: true,
//         extraKeys: {
//           'Ctrl-Space': 'autocomplete',
//           'Ctrl-LeftClick': function (cm, e) {
//             // its a redefine
//           },
//         },
//         mode: 'jsx',
//         theme: 'material',
//         lineNumbers: true,
//         lineWrapping: false,
//         htmlMode: true,
//         hintOptions: { hint: renderTagAutoComplete },
//       }}
//       ref={editor}
//       onChange={onChange}
//     />
//   );
// }
