import { html } from 'htm/preact';
import * as preact from 'preact/compat';
import findLastIndex from 'lodash/findLastIndex';
import { promised } from './promised';


export const loadedScripts: { [id: string]: any } = {};
window.__loadedScripts = loadedScripts;

function unload(id) {
  if (loadedScripts[id]) {
    loadedScripts[id].element.remove();
    delete loadedScripts[id];
  }
}

function reactToHtmPreact(execCode: string) {
  const tags: number[] = [];
  let prev = 0;
  let fixedCode = '';
  for (let i = 0; i < execCode.length; i++) {
    const c = execCode[i];
    const c2 = execCode[i + 1];
    if (c === '<' && c2 !== '/') {
      tags.push(i);
    } else if ((c === '<' && c2 === '/') || (c === '/' && c2 === '>')) {
      const start = tags.pop()!;
      const end = c === '<' ? execCode.indexOf('>', i) + 1 : i + 1;
      if (!tags.length) {
        fixedCode += execCode.slice(prev, start);
        fixedCode += 'html`' +
          execCode.slice(start, end)
            .replace(/\{(.*?)\}/g, '${$1}')
            .replace(/<([A-Z][\w\d_]+)/g, '<${$1}')
          + '`';
        prev = end;
      }
    }
  }
  fixedCode += execCode.slice(prev);
  return fixedCode;
}

function minify(strs, ...objs) {
  let res = strs[0];
  for (let i = 0; i < objs.length; i++) {
    res += objs[i].toString() + strs[i + 1];
  }
  return res.trim().split('\n').join(' ');
}

export function loadScript(id: string, code: string, context) {
  let loaded = loadedScripts[id];
  if (loaded) {
    if (loaded.code === code) {
      return Promise.resolve(loaded);
    } else {
      unload(id);
    }
  }

  const prom = promised();
  loaded = {
    id,
    prom,
    code,
    context: {
      html,
      preact,
      ...context,
    },
    ready: false,
    unload() {
      unload(this.id);
    },
    onReady() {
      // @ts-ignore
      window.onerror = undefined;
      this.ready = true;
      context.onReady?.();
      this.prom.resolve(this);
      delete this.prom;
    },
    onError(err) {
      this.error = err;
      context.onError?.(err);
      this.prom.reject(err);
      delete this.prom;
    },
  };
  window.onerror = err => loaded.onError(new Error(err));
  loadedScripts[id] = loaded;

  const codeLines = code.split('\n');
  const importsIdx = findLastIndex(codeLines, line => line.startsWith('import'));
  const imports = codeLines.slice(0, importsIdx + 1).join('\n');
  const execCode = codeLines.slice(importsIdx + 1).join('\n');
  const fixedCode = reactToHtmPreact(execCode);

  console.log(fixedCode);

  const loader = `${imports} ${minify`
  const __ls = window.__loadedScripts['${id}'];
  
  (async function() {
  try {
    const { html, add, Render, preact, ...context } = __ls.context;
    `}
    ////////////// user code /////////////////
    
    ${fixedCode}
    
    ////////////// user code /////////////////
    ${minify`
    __ls.onReady();
  } catch (err) {
    __ls.onError(err);
  }
  })().catch(err => __ls.onError(err));
  //# sourceURL=${id}.js`}`;

  try {
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = loader;
    loadedScripts[id].element = document.getElementsByTagName('head')[0].appendChild(script);
  } catch (err) {
    console.error('script', loaded, 'failed to load', err);
    loaded.onError(err);
  }

  return prom;
}
