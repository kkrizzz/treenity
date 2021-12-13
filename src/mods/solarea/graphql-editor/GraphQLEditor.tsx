import React from 'react';
import './GraphQLEditor.css';
import './editor.css';
import GalleryComponent from './components/GalleryComponent';
import { GraphqlExplorer } from './components/GraphqlExplorer';

const GraphQLEditor = () => {
  return (
    <div className="App">
      <div className="content flex">
        <GalleryComponent />
        <GraphqlExplorer />
      </div>
    </div>
  );
};

export default GraphQLEditor;
