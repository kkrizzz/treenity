import React, { useEffect, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { getComponent } from '../db/component-db';
import { loadScriptComponent } from '../../uix/compiler/load-script-component';
import { useRestStorage } from './adapters/RestStorageAdapter';
import { apis } from './apis';

// const addressRegEx = /^[A-z0-9:\.\-_]+$/;

interface ComponentInfo {}

export function useLoadURLComponent(url: string): [ComponentInfo | null, boolean] {
  // if (!addressRegEx.test(address)) throw new Error('bad address');
  const protocol = url.slice(0, url.indexOf(':'));
  const loader = apis[protocol];
  if (!loader) throw new Error('protocol not found for url: ' + url);

  const config = getComponent(url);

  const [loading, setLoading] = useState(!config);

  useEffect(() => {
    if (!getComponent(url)) setLoading(true);
  }, [url]);

  if (config || !loading) {
    // need this one empty to match next one
    useAsyncEffect(async () => {
      setLoading(false);
    }, []);

    return [config, loading];
  }

  useEffect(() => {
    loadScriptComponent(url, [loader]).finally(() => setLoading(false));
  }, [url]);

  return [null, loading];
}
