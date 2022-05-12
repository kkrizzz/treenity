import { useLoadURLComponent } from '../storage/useLoadURLComponent';
import React from 'react';

interface RenderURLProps {
  url: string;
  children?: any;

  loading?: (any) => JSX.Element;
  loaderHook?: any;

  [more: string]: any;
}

export function Render(props: RenderURLProps) {
  const { url, children, fallback, render, loading, loaderHook, ...other } = props;
  const [componentInfo, isLoading] = loaderHook?.(props) || useLoadURLComponent(url);

  // console.log('rendering', id, name, context, isLoading);
  if (isLoading) {
    return loading ? loading(props) : <span className="spinner-grow spinner-grow-sm m-r-4" />;
  }

  if (!componentInfo) {
    if (fallback !== undefined) return fallback(props);
    return 'not found';
  }

  let result: JSX.Element | null = null;
  try {
    const { component: Component, props } = componentInfo;

    result = <Component {...other} url={url} children={children} />;
  } catch (e) {
    console.error('RenderURL', url, e);
  }

  if (render) return render(result, props);

  return result;
}

export const render = (url: string, defProps) => (props) => Render({ url, ...defProps, ...props });

export default Render;
