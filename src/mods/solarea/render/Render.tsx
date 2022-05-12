import React from 'react';
// import { useAccount } from '../hooks/useAccount';
// import { useLoadComponent } from '../hooks/useLoadComponent';
// import { useGraphQL } from '../hooks/useGraphQL';
// import { ComponentWrapper } from './ComponentWrapper';
import { Render as RenderURL } from '../../uix/render/Render';
export { Render as RenderURL } from '../../uix/render/Render';

import { useLoadURLComponent } from '../../uix/storage/useLoadURLComponent';

interface RenderProps {
  id: string;
  name?: string;
  context?: string;
  children?: any;

  loading?: (any) => JSX.Element;
  loaderHook?: any;

  [more: string]: any;
}

function Render(props: RenderProps) {
  const {
    id,
    name = 'default',
    context = 'react',
    // children,
    // fallback,
    // render,
    // loading,
    // loaderHook,
    ...more
  } = props;

  const url = more.url || `sol:${id}/${context}/${name}`;

  return RenderURL({ ...more, url });
}

export const render = (id: string, name: string, context: string, defProps) => (props) =>
  Render({ id, name, context, ...defProps, ...props });

export default Render;
