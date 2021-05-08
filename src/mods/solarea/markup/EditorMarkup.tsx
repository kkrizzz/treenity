import React from 'react';
import { addComponent } from '../component-db';

export default function EditorMarkup() {
  return <div>ExplorerMarkup</div>;
}

addComponent('markup', 'editor', 'react', {}, EditorMarkup);
