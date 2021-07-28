import React, { useEffect, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { mimeTypesData } from '../utils/mime-types-data';
import { addComponent, getComponent } from '../component-db';
import { loadScript } from '../load-script';
import Render, { render } from '../Render';
import { resolveViewByMime } from '../components/Files/Resolver';
import { useRestStorage, useSolanaStorage } from '../storage-adapters/StorageProvider';
import { SolareaViewId } from '../storage-adapters/SolareaViewId';
import { SolareaViewData } from '../storage-adapters/IStorageAdapter';

const addressRegEx = /^[A-z0-9:\.\-_]+$/;

const makeDefaultData = (id) => new SolareaViewData(id, 0x1, Buffer.from('add(() => "not found")'));

export function useLoadAccountComponent(
  address: string,
  name: string,
  context: string,
): [any, boolean] {
  if (!addressRegEx.test(address)) throw new Error('bad address');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getComponent(address, name, context)) setLoading(true);
  }, [address, name, context]);

  const config = getComponent(address, name, context);
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
    const id = new SolareaViewId(address, name, context);
    try {
      // do {
      const [solSettle, restSettle] = await Promise.allSettled([
        solanaStorage.get(id, { resolveLinks: true }),
        restStorage.get(id, { resolveLinks: true }),
      ]);

      const viewData =
        (solSettle.status === 'fulfilled' && solSettle.value) ||
        (restSettle.status === 'fulfilled' && restSettle.value);

      if (!viewData) return;

      const mimetype = mimeTypesData.getMime(viewData.type);

      if (viewData.type === mimeTypesData['solarea/jsx']) {
        const viewCode = viewData.data.toString('utf-8');

        await loadScript(id.id, viewCode, {
          Render,
          render,
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
    } finally {
      setLoading(false);
    }
  }, [address, name, context]);

  return [null, loading];
}
