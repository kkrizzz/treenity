import { useEffect, useState } from 'react';
import { html } from 'htm/preact';
import * as React from 'react';
import { useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import set from 'lodash/set';
import memoize from 'lodash/memoize';
import useAsyncEffect from 'use-async-effect';
import { promised } from './promised';
import {add} from "winston";
import StorageManager from "./storageInterface";

const PROGRAM_ID = new PublicKey('So11111111111111111111111111111111111111112');
const derivedKey = memoize(async function derivedKey(accountId, context, name) {
  return await PublicKey.findProgramAddress(
    [new PublicKey(accountId).toBuffer(), Buffer.from(`${context}/${name}`, 'utf8')],
    PROGRAM_ID,
  );
});

const loadedScripts: { [code: string]: boolean } = {};
export const components: { [code: string]: any } = {};
const readys: { [code: string]: any } = {};


export function loadScript(address, context, code) {
  const script = document.createElement('script');
  script.type = 'module';

  let component;
  window.__addComponent = (address, context, comp) => set(components, [address, context], comp);

  const prom = promised();
  window.__ready = (address, context) => setTimeout(() => prom.resolve(components[address]?.[context]));

  window.t__context = { preact: { ...React, html } };

  const loader = `
    const add = (comp) => window.__addComponent('${address}', '${context}', comp);
    const { preact } = window.t__context;

      ${code}
    
    window.__ready('${address}', '${context}');
    `;

  script.innerHTML = loader;
  document.getElementsByTagName('head')[0].appendChild(script);

  return prom;
}

export function useAccount(address: string): [AccountInfo<Buffer> | undefined, boolean] {
  const conn = useConnection();
  const { data: accountInfo, isLoading } = useQuery(
    `acc_${address}`,
    () => conn.getAccountInfo(new PublicKey(address)),
  );
  return [accountInfo, isLoading];
}


export function useAccountComponent(address: string, context: string, name: string) {
  if (!/^[A-z0-9]+$/.test(address)) throw new Error('bad address');

  const [loading, setLoading] = useState(true);
  const [accountInfo, isLoading] = useAccount(address);

  const { data: code, isLoading: isScriptLoading } = useQuery(
    `acc_${address}_${context}_${name}`,
    async () => {
      return await scriptCode(address, name, context);
    },
  );

  useAsyncEffect(async () => {
    if (!code || isScriptLoading || loadedScripts[code]) return;
    loadedScripts[code] = true;

    await loadScript(address, context, code);
    setLoading(false);
  }, [code, isScriptLoading, setLoading]);

  return [components[address]?.[context], loading, []];
}

async function scriptCode(addr, name, context) {
  return {context: ''}[context]
}
