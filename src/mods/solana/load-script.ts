import { html } from 'htm/preact';
import { promised } from './promised';


export const loadedScripts: { [id: string]: any } = {};
window.__loadedScripts = loadedScripts;

function unload(id) {
  if (loadedScripts[id]) {
    loadedScripts[id].element.remove();
    delete loadedScripts[id];
  }
}

export async function loadScript(id, code, context) {
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

  const loader = `(async function() {
    const __ls = window.__loadedScripts['${id}'];
    try {
      const { html, add, ...context } = __ls.context;

      ${code}
    
      __ls.onReady();
    } catch (err) {
      __ls.onError(err);
    }
  })()`;

  const script = document.createElement('script');
  script.type = 'module';
  script.innerHTML = loader;
  loadedScripts[id].element = document.getElementsByTagName('head')[0].appendChild(script);

  return prom;
}
