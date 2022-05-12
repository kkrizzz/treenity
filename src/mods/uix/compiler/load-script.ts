import { html } from 'htm/preact';
import { promised } from '../../../utils/promised';
import { minify, reactToHtmPreact } from './transpiler';

export const loadedScripts: { [id: string]: any } = {};
globalThis.__loadedScripts = loadedScripts;

function unload(id) {
  if (loadedScripts[id]) {
    loadedScripts[id].element.remove();
    delete loadedScripts[id];
  }
}

export function loadScript(id: string, code: string, context: any) {
  let loaded = loadedScripts[id];
  if (loaded) {
    if (loaded.code === code) {
      return loaded.prom || Promise.resolve(loaded);
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
      require: (url) => {
        return globalThis.System.import(url);
      },
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
  globalThis.onerror = (err) => loaded.onError(err);
  loadedScripts[id] = loaded;

  const codeLines = code.split('\n');
  const importsIdx =
    codeLines
      .slice()
      .reverse()
      .findIndex((line) => line.startsWith('import')) + 1;
  const imports = codeLines.slice(0, importsIdx).join('\n');
  const execCode = codeLines.slice(importsIdx).join('\n');
  const fixedCode = reactToHtmPreact(execCode);

  // console.log(fixedCode);

  const loader = `${imports} ${minify`
  const __ls = window.__loadedScripts['${id}'];

  (async function() { try {
    const { useCSS, css, require, html, add, Render, render, preact, ...context } = __ls.context;`}
    ////////////// user code /////////////////
    
    ${fixedCode}
    
    ////////////// user code /////////////////
    ${minify`
    __ls.onReady();
  } catch (err) { __ls.onError(err) }
  })().catch(err => __ls.onError(err));
  //# source${'URL'}=${id}.js`}`;

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
