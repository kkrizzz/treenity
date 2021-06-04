import React from 'react';
import { addComponent } from '../component-db';

export default function ExplorerMarkup() {
  return <div>ExplorerMarkup</div>;
}

addComponent('markup', 'explorer', 'react', {}, ExplorerMarkup);
