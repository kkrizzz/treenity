import React, { useEffect, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import memoize from 'lodash/memoize';
import { Connection, PublicKey } from '@solana/web3.js';

import { getMultipleAccounts } from '../utils/get-multiple-accounts';
import { mimeTypesData } from '../utils/mime-types-data';
import { sleep } from '../utils/sleep';
import { makeId } from '../utils/make-id';
import { addComponent, getComponent } from '../component-db';
import { restStorageManager } from '../storage-adapters/rest-storage-manager';
import { loadScript } from '../load-script';
import Render from '../Render';
import { solareaApi } from '../client';
import { createViewAddress } from '../program-api/solarea-program-api';
import { useConnection } from './useConnection';
import { resolveViewByMime } from '../components/Files/Resolver';
import { useSolanaStorage, useRestStorage } from '../storage-adapters/SolanaStorageProvider';
import { SolareaViewId } from '../storage-adapters/SolareaViewId';

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

  const solanaStorage = useSolanaStorage();
  const restStorage = useRestStorage();

  useAsyncEffect(async () => {
    const id = new SolareaViewId(address, name, context);
    try {
      let link = id;
      let contextConfig;
      // do {
      const [solSetttle, restSettle] = await Promise.allSettled([
        solanaStorage.get(id),
        restStorage.get(id),
      ]);

      let viewData;

      if (solSetttle.status === 'fulfilled' && solSetttle.value) {
        const { owner, data, type } = solSetttle.value;
        viewData = data.toString('utf-8');

        const mimetype = mimeTypesData.getData(type);

        if (mimetype) {
          addComponent(address, name, context, {}, () => resolveViewByMime({ mimetype, data }));
          return setLoading(false);
        }
      } else if (restSettle.status === 'fulfilled') {
        viewData = restSettle.value!.data;
      } else {
        viewData = 'add(() => "not found")';
      }

      await loadScript(id, viewData, {
        Render,
        add(component, options = {}): void {
          component.displayName = id;
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
