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

const PROGRAM_ID = new PublicKey('So11111111111111111111111111111111111111112');
const derivedKey = memoize(async function derivedKey(accountId, context, name) {
  return await PublicKey.findProgramAddress(
    [new PublicKey(accountId).toBuffer(), Buffer.from(`${context}/${name}`, 'utf8')],
    PROGRAM_ID,
  );
});

const loadedScripts: { [code: string]: boolean } = {};
const components: { [code: string]: any } = {};
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
    import { Connection } from 'unpkg.com/@solana/web3.js';
  
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

  const conn = useConnection();
  const [loading, setLoading] = useState(true);

  const { data: accountInfo, isLoading } = useQuery(
    `acc_${address}`,
    () => conn.getAccountInfo(new PublicKey(address)),
  );
  const { data: code, isLoading: isScriptLoading } = useQuery(
    `acc_${address}_${context}_${name}`,
    async () => {
      // const [derived, nonce] = await derivedKey(address, context, name);
      // const derivedAccount = await conn.getAccountInfoAndContext(derived);
      return scriptCode(address, context); //derivedAccount?.data.toString() || scriptCode(address, context);
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

function scriptCode(addr, context) {
  const scripts = {
    'So11111111111111111111111111111111111111112': {
      react: `
      const { useState, html } = preact;

      const ClickCounter = () => {
        const [count, setCount] = useState(0);
        const increment = () => setCount(count + 1);
        return html\`
          <div>
            This is main Solana smart contract!
            <button onClick=\${increment}>
              Clicked \${count} times
            </button>
          </div>
        \`;
      };

      add(ClickCounter);`,
    },
    'So11111111111111111111111111111111111111113': {},
  };
  return scripts[addr][context];
}
