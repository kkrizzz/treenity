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
  (id, name, context, { query: { edit, grid, ...query }, hostname }) => {
    if (edit !== undefined && grid !== undefined) {
      return (
        <Suspense fallback={<div>Loading Grid Layout...</div>}>
          <Render id={hostname} name="layout" context={context} query={query}>
            <EditorGridLayout {...query} id={id} name={name} context={context} />
          </Render>
        </Suspense>
      );
    }
  },
  (id, name, context, { query: { edit, ...query } }) => {
    if (edit !== undefined) {
      return (
        <Suspense fallback={<div>Loading Editor...</div>}>
          <SolareaEdit {...query} value={null} id={id} name={name} context={context} />
        </Suspense>
      );
    }
  },
  (id, name, context, { query: { nolayout, ...query } }) => {
    if (nolayout !== undefined) {
      return <Render {...query} id={id} context={context} name={name} />;
    }
  },
  (id, name, context, { hostname, query }) => {
    // all other names
    const fallback = () => <Render {...query} id={id} context={context} name={name} />;
    return (
      <Render id={hostname} name="layout" context={context} fallback={fallback} query={query}>
        {fallback()}
      </Render>
    );
  },
];

function resolveView(id: string, name: string, context: string, opts) {
  return findMap(idToViewResolvers, (resolver) => resolver(id, name, context, opts));
}

export default function SolareaRoute() {
  let [id, name, context, hostname] = useParams();
  const query = useQueryParams();

  const ctx = `react${context && !context.startsWith('react') ? ` ${context}` : ''}`;

  return resolveView(id, name, ctx, { query, hostname });
}
