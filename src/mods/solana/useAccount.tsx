import { html } from 'htm/preact';
import * as React from 'react';
import { useConnection } from './useConnection';
import { useQuery } from 'react-query';
import { PublicKey } from '@solana/web3.js';
import set from 'lodash/set';
import memoize from 'lodash/memoize';
import { useEffect, useState } from 'react';

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
  useEffect(() => {
    if (!code || isScriptLoading || loadedScripts[code]) return;
    loadedScripts[code] = true;

    const script = document.createElement('script');
    script.type = 'module';

    let component;
    window.__addComponent = (address, context, comp) => set(components, [address, context], comp);
    set(readys, [address, context], setLoading);
    window.__ready = (address, context) => setTimeout(() => readys[address][context](false));
    window.t__context = { preact: { ...React, html } };

    const loader = `
    const add = (comp) => window.__addComponent('${address}', '${context}', comp);
    const { preact } = window.t__context;

      ${code}
    
    window.__ready('${address}', '${context}');
    `;

    script.innerHTML = loader;
    document.getElementsByTagName('head')[0].appendChild(script);
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
