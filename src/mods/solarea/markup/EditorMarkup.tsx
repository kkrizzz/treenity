import React from 'react';
import {addComponent} from '../component-db';
import {Snippets} from "./snippets/Snippets";
import {MenuMarkup} from "./menuMarkup/MenuMarkup";
import CodeMirror from '../editor/CodeMirror';

import './markup.scss';

export default function EditorMarkup() {
  return (
    <div className="markup-wr">
      <MenuMarkup />
      <Snippets />
      <CodeMirror
        value=""
        onChange={ () => {
          return true
        }}
      />
      <div className="markup-preview">Preview</div>
    </div>
  )
}

addComponent('markup', 'editor', 'react', {}, EditorMarkup);
