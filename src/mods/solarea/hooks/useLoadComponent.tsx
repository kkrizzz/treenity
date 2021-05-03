import { useEffect, useState } from 'react';
import { addComponent, getComponent } from '../component-db';
import useAsyncEffect from 'use-async-effect';
import { makeId } from '../utils/make-id';
import { restStorageManager } from '../rest-storage-manager';
import { loadScript } from '../load-script';
import Render from '../Render';
import { connection } from '@feathersjs/authentication/lib/hooks';
import { solareaApi } from '../client';
import { createViewAddress } from '../program-api/solarea-program-api';
import { PublicKey } from '@solana/web3.js';
import { useConnection } from './useConnection';

const addressRegEx = /^[A-z0-9:\.\-_]+$/;

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

  const connection = useConnection();

  useAsyncEffect(async () => {
    const id = await makeId(address, name, context);
    try {
      let link = id;
      let contextConfig;

      const viewAddress = address.length > 32 ? new PublicKey(address).toBuffer() : address;
      const [storageAddress] = createViewAddress(viewAddress, context, name);
      // do {
      const [solSetttle, restSettle] = await Promise.allSettled([
        connection.getAccountInfo(storageAddress),
        restStorageManager.get(contextConfig?.link || id),
      ]);

      let viewData;

      if (solSetttle.status === 'fulfilled' && solSetttle.value) {
        const { owner, data, type } = solareaApi.unpackData(solSetttle.value.data);
        viewData = data.toString('utf-8');
      } else if (restSettle.status === 'fulfilled') {
        viewData = restSettle.value!.data;
      } else {
        viewData = 'add(() => "not found")';
      }

      // link = contextConfig.link;
      // } while (contextConfig.link);

      await loadScript(id, viewData, {
        Render,
        add(component, options = {}): void {
          addComponent(address, name, context, options, component);
        },
      });
    } catch (err) {
      console.log(err);
      addComponent(
        address,
        name,
        context,
        {},
        getComponent('default', 'default', context).component,
      );
    }
    setLoading(false);
  }, [address, name, context]);

  return [null, loading];
}
