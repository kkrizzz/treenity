import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Craft from './craft/Craft';
import { RenderRoute } from '../treenity/react/current-node';
import { AppProvider } from '../treenity/react/useApp';
import client from './feathers';

export default () => {
  return (
    <AppProvider value={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RenderRoute />} />
          <Route path="/:id" element={<RenderRoute />} />
          <Route path="/:rootId/:id" element={<RenderRoute />} />
          <Route path="/:rootId/:id/:context" element={<RenderRoute />} />

          <Route path="/craft" element={<Craft />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};
