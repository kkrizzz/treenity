import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Craft from './craft/Craft';
import DateRange from './components/DateRange';
import { RenderRoute } from '../treenity/react/current-node';
import { AppProvider } from '../treenity/react/useApp';
import client from './feathers';
import { NodeGraph } from '../mods/channels/client/NodeGraph';

export default () => {
  return (
    <AppProvider value={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/craft" element={<Craft />} />
          <Route path="/node-graph" element={<NodeGraph />} />
          <Route path="/date-range" element={<DateRange />} />

          <Route path="/" element={<RenderRoute />} />
          <Route path="/:id" element={<RenderRoute />} />
          <Route path="/:rootId/:id" element={<RenderRoute />} />
          <Route path="/:rootId/:id/:context" element={<RenderRoute />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};
