import React from 'react';
import { addComponent, getComponent } from '../component-db';
import { loadScript } from '../../solarea-ui/compiler/load-script';
import { createExecutionContext } from '../utils/create-execution-context';
import { useQuery } from 'react-query';

interface RenderCodeProps {
  id: string;
  children?: any;
  code: string;

  [more: string]: any;
}

export function useLoadCodeComponent(id: string, code: string) {
  const { data: componentInfo, isLoading } = useQuery(
    id,
    async () => {
      let config = getComponent(id, 'default', 'react');
      if (!config) {
        await loadScript(id, code, {
          ...createExecutionContext(),
          add(component, options = {}): void {
            component.displayName = `code_${id}`;
            addComponent(id, 'default', 'react', options, component);
          },
        });
        config = getComponent(id, 'default', 'react');
      }
      return config;
    },
    { refetchInterval: false },
  );
  return [componentInfo, isLoading];
}

export function codeLoaderHook({ id, code }) {
  return useLoadCodeComponent(id, code);
}
