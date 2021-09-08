import React, { useEffect, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { mimeTypesData } from '../utils/mime-types-data';
import { addComponent, getComponent } from '../component-db';
import { loadScript } from '../compiler/load-script';
import { resolveViewByMime } from '../components/Files/Resolver';
import { useRestStorage, useSolanaStorage } from '../storage-adapters/StorageProvider';
import { SolareaViewId } from '../storage-adapters/SolareaViewId';
import { createExecutionContext } from '../utils/create-execution-context';

const addressRegEx = /^[A-z0-9:\.\-_]+$/;

async function loadScriptComponent(address, name, context, apis: any[]) {
  const id = new SolareaViewId(address, name, context);
  try {
    // do {
    const results = await Promise.allSettled(
      apis.map((api) => api.get(id, { resolveLinks: true })),
    );

    const viewData = (results.find(
      (res) => res.status === 'fulfilled' && res.value,
    ) as PromiseFulfilledResult<any>)?.value;

    if (!viewData) return;

    const mimetype = mimeTypesData.getMime(viewData.type);

    if (viewData.type === mimeTypesData['solarea/jsx']) {
      const viewCode = viewData.data.toString('utf-8');

      await loadScript(id.id, viewCode, {
        ...createExecutionContext(),
        add(component, options = {}): void {
          component.displayName = id.id;
          addComponent(address, name, context, options, component);
        },
      });
    } else if (mimetype) {
      addComponent(address, name, context, {}, () =>
        resolveViewByMime({ mimetype, data: viewData.data }),
      );
    } else {
      throw new Error(`mimetype not resolved ${viewData.type}`);
    }
  } catch (err) {
    console.log(err);
    // addComponent(address, name, context, {}, getComponent('default', 'default', context).component,);
  }
}

export function useLoadAccountComponent(
  address: string,
  name: string,
  context: string,
): [any, boolean] {
  if (!addressRegEx.test(address)) throw new Error('bad address');

  const config = getComponent(address, name, context);

  const [loading, setLoading] = useState(!config);

  useEffect(() => {
    if (!getComponent(address, name, context)) setLoading(true);
  }, [address, name, context]);

  if (config || !loading) {
    // need this one empty to match next one
    useAsyncEffect(async () => {
      setLoading(false);
    }, []);

    return [config, loading];
  }

  const solanaStorage = useSolanaStorage();
  const restStorage = useRestStorage();

  useAsyncEffect(async () => {
    loadScriptComponent(address, name, context, [solanaStorage, restStorage]).finally(() =>
      setLoading(false),
    );
  }, [address, name, context]);

  return [null, loading];
}
