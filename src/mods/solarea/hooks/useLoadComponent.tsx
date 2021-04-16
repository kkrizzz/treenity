import {useEffect, useState} from 'react';
import { addComponent, getComponent } from '../component-db';
import useAsyncEffect from 'use-async-effect';
import { makeId } from '../utils/make-id';
import { restStorageManager } from '../rest-storage-manager';
import { loadScript } from '../load-script';
import Render from '../Render';

const addressRegEx = /^[A-z0-9:\.]+$/;

export function useLoadAccountComponent(address: string, name: string, context: string): [any, boolean] {
  if (!addressRegEx.test(address)) throw new Error('bad address');

  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(!getComponent(address, name, context)) setLoading(true)
  }, [address, name, context])

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
      let link = id;
      let contextConfig;
      do {
        contextConfig = await restStorageManager.get(contextConfig?.link || id);
        link = contextConfig.link;
      } while (contextConfig.link);
      await loadScript(id, contextConfig.data, {
        Render,
        add(component, options = {}): void {
          addComponent(address, name, context, options, component);
        },
      });
    } catch (err) {
      addComponent(address, name, context, {}, getComponent('default', 'default', context).component);
    }
    setLoading(false);
  }, [address, name, context]);

  return [null, loading];
}
