import React, { useEffect, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import memoize from 'lodash/memoize';
import { Connection, PublicKey } from '@solana/web3.js';

import { getMultipleAccounts } from '../utils/get-multiple-accounts';
import { mimeTypesData } from '../utils/mime-types-data';
import { sleep } from '../utils/sleep';
import { makeId } from '../utils/make-id';
import { addComponent, getComponent } from '../component-db';
import { restStorageManager } from '../rest-storage-manager';
import { loadScript } from '../load-script';
import Render from '../Render';
import { solareaApi } from '../client';
import { createViewAddress } from '../program-api/solarea-program-api';
import { useConnection } from './useConnection';
import { resolveViewByMime } from '../components/Files/Resolver';

const addressRegEx = /^[A-z0-9:\.\-_]+$/;

let currentAddrs: PublicKey[] = [];
let currentCachesPromise: Promise<any> | null = null;

/**
 * Collect accounts loading for some time, and then load all at once
 */
const loadSolanaAccount = memoize(
  async (connection: Connection, address: PublicKey) => {
    // if not yet waiting - create new waiting promise
    let prom = currentCachesPromise;
    if (!prom) {
      const loadAllAccounts = () => {
        const addrs = currentAddrs;
        currentAddrs = [];
        currentCachesPromise = null;
        return getMultipleAccounts(connection, addrs, 'recent');
      };
      // wait 50ms to collect more accounts
      prom = currentCachesPromise = sleep(50).then(loadAllAccounts);
    }

    const loadAccount = async () => {
      const idx = currentAddrs.length;
      // add account to current wait promise
      currentAddrs.push(address);
      const accounts = await prom;
      const value = accounts.value[idx];
      return value && new Buffer(value.data[0], 'base64');
    };

    return loadAccount();
  },
  (conn, pubkey) => pubkey.toBase58(),
);

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
      const [storageAddress] = createViewAddress(address, context, name);
      // do {
      const [solSetttle, restSettle] = await Promise.allSettled([
        loadSolanaAccount(connection, storageAddress),
        restStorageManager.get(contextConfig?.link || id),
      ]);

      let viewData;

      if (solSetttle.status === 'fulfilled' && solSetttle.value) {
        const { owner, data, type } = solareaApi.unpackData(solSetttle.value);
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
