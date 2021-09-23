import React, { Suspense } from 'preact/compat';

import useParams from './hooks/useParams';
import useQueryParams from './hooks/useQueryParams';
import Render from './render/Render';
import findMap from '../../utils/find-map';

// import SolareaEdit from './editor/NewEditor/SolareaEdit3';
// import EditorGridLayout from './editor/NewEditor/EditorGridLayout';
const SolareaEdit = React.lazy(() => import('./editor/NewEditor/SolareaEdit3'));
const EditorGridLayout = React.lazy(() => import('./editor/NewEditor/EditorGridLayout'));

const idToViewResolvers = [
  (id, name, context, { edit, grid, ...query }) => {
    if (edit !== undefined && grid !== undefined) {
      return (
        <Suspense fallback={<div>Loading Grid Layout...</div>}>
          <EditorGridLayout {...query} id={id} name={name} context={context} />
        </Suspense>
      );
    }
  },
  (id, name, context, { edit, ...query }) => {
    if (edit !== undefined) {
      return (
        <Suspense fallback={<div>Loading Editor...</div>}>
          <SolareaEdit {...query} value={null} id={id} name={name} context={context} />
        </Suspense>
      );
    }
  },
  (id, name, context, query) => {
    if (['velas-dextools'].includes(id)) {
      return (
        <Render id="velas-dextools" name="layout" context={context}>
          <Render {...query} id={id} context={context} name={name} />
        </Render>
      );
    }
  },
  (id, name, context, query) => {
    if (['coin'].includes(id)) {
      return (
        <Render id="velas-dextools" name="layout" context={context}>
          <Render {...query} entityId={name} id="velas-dextools" context={context} name="coin" />
        </Render>
      );
    }
  },
  (id, name, context, { nolayout, ...query }) => {
    if (nolayout !== undefined) {
      return <Render {...query} id={id} context={context} name={name} />;
    }
  },
  (id, name, context, query) => {
    // all other names
    return (
      <Render id="layout" name="default" context={context}>
        <Render {...query} id={id} context={context} name={name} />
      </Render>
    );
  },
];

function resolveView(id: string, name: string, context: string, query) {
  return findMap(idToViewResolvers, (resolver) => resolver(id, name, context, query));
}

export default function SolareaRoute() {
  let [id, name, context] = useParams();
  const query = useQueryParams();

  const ctx = `react${context && !context.startsWith('react') ? ` ${context}` : ''}`;

  return resolveView(id, name, ctx, query);
}
