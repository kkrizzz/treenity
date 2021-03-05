import { useState } from 'react';
import { addComponent, getComponent } from '../component-db';
import useAsyncEffect from 'use-async-effect';
import { makeId } from '../utils/make-id';
import { restStorageManager } from '../rest-storage-manager';
import { loadScript } from '../load-script';

const addressRegEx = /^[A-z0-9]+$/;

export function useLoadAccountComponent(address: string, name: string, context: string): [any, boolean] {
  if (!addressRegEx.test(address)) throw new Error('bad address');

  const [loading, setLoading] = useState(true);

  const config = getComponent(address, name, context);
  if (config || !loading) {
    // need this one empty to match next one
    useAsyncEffect(async () => {
      setLoading(false);
    }, []);

    return [config, loading];
  }

  useAsyncEffect(async () => {
    const id = await makeId(address, name, context);
    try {
      const contextConfig = await restStorageManager.get(id);
      await loadScript(id, contextConfig.data, {
        add(component): void {
          addComponent(address, name, context, {}, component);
        },
      });
    } catch (err) {
      addComponent(address, name, context, {}, getComponent('default', 'default', context).component);
    }
    setLoading(false);
  }, [address, name, context]);

  return [null, loading];
}
