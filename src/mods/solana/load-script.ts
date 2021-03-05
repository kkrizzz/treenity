import { html } from 'htm/preact';
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

export function loadScript(id, code, context) {
  let loaded = loadedScripts[id];
  if (loaded) {
    if (loaded.code === code) {
      return loaded;
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
      ...context,
    },
    ready: false,
    unload() {
      unload(this.id);
    },
    onReady() {
      this.ready = true;
      this.prom.resolve(this);
      delete this.prom;
    },
    onError(err) {
      this.error = err;
      this.prom.reject(err);
      delete this.prom;
    },
  };
  loadedScripts[id] = loaded;

  const codeLines = code.split('\n');
  const importsIdx = findLastIndex(codeLines, line => line.startsWith('import'));
  const imports = codeLines.slice(0, importsIdx + 1).join('\n');
  const execCode = codeLines.slice(importsIdx + 1).join('\n');

  const loader = `
  ${imports}
  (async function() {
    const __ls = window.__loadedScripts['${id}'];
    const { html, add, ...context } = __ls.context;

      ${execCode}
    
      __ls.onReady();
  })().catch(__ls.onError)`;

  try {
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = loader;
    loadedScripts[id].element = document.getElementsByTagName('head')[0].appendChild(script);
  } catch (err) {
    console.error('script', loaded, 'failed to load', err);
    // return Promise.reject(err);
  }

  return prom;
}
