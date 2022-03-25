import { html } from 'htm/preact';
import findLastIndex from 'lodash/findLastIndex';
import { promised } from '../../solarea/utils/promised';

export const loadedScripts: { [id: string]: any } = {};
globalThis.__loadedScripts = loadedScripts;

function unload(id) {
  if (loadedScripts[id]) {
    loadedScripts[id].element.remove();
    delete loadedScripts[id];
  }
}

/**
 * transpile JSX-like file to plain js-with-htm file
 * @param code
 */
function fixHtmlInnerCode(code: string) {
  const inners: number[] = [];
  let prev = 0;
  let fixedCode = '';
  for (let i = 0; i < code.length; i++) {
    const c = code[i];

    if (c === '{' && code[i + 1] !== '/') {
      inners.push(i);
    } else if (c === '}' && code[i - 1] !== '/') {
      const start = inners.pop() || 0;
      if (inners.length !== 0) continue;
      const end = i;
      fixedCode += code.slice(prev, start);
      fixedCode += '${' + reactToHtmPreact(code.slice(start + 1, end));
      prev = end;
    }
  }
  fixedCode += code.slice(prev);
  return fixedCode;
}

function fixFragments(jsxText: string) {
  if (jsxText.startsWith('<>') && jsxText.endsWith('</>')) {
    jsxText = jsxText.slice(2, -3);
  }

  return jsxText;
}

export function reactToHtmPreact(execCode: string) {
  const tags: number[] = [];
  let prev = 0;
  let fixedCode = '';
  for (let i = 0; i < execCode.length; i++) {
    const c = execCode[i];
    const c2 = execCode[i + 1];
    if (c === '<' && c2 !== '/' && !['<', '=', ' '].includes(c2)) {
      tags.push(i);
    } else if ((c === '<' && c2 === '/') || (c === '/' && c2 === '>' && execCode[i + 2] !== '*')) {
      const start = tags.pop()!;
      const end = c === '<' ? execCode.indexOf('>', i) + 1 : i + 2;
      if (!tags.length) {
        let jsxText = fixHtmlInnerCode(execCode.slice(start, end).trim())
          // replace all spread component props like {...obj} to ...${obj} in jsx
          .replace(/\${\.\.\./g, '...${')
          // replace all comments like {/* some comment */} to empty string
          .replace(/{\/\*((.|\n)*?)\*\/}/g, '')
          // .replace(/\{(.*?)\}/g, '${$1}')
          .replace(/<([A-Z][\w\d_]*)/g, '<${$1}');
        jsxText = fixFragments(jsxText);

        fixedCode += execCode.slice(prev, start);
        fixedCode += 'html`' + jsxText + '`';
        prev = end;
        i = prev;
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
  const importsIdx = findLastIndex(codeLines, (line) => line.startsWith('import'));
  const imports = codeLines.slice(0, importsIdx + 1).join('\n');
  const execCode = codeLines.slice(importsIdx + 1).join('\n');
  const fixedCode = reactToHtmPreact(execCode);

  // console.log(fixedCode);

  const loader = `${imports} ${minify`
  const __ls = window.__loadedScripts['${id}'];

  (async function() {
  try {
    const { useCSS, css, require, html, add, Render, render, preact, ...context } = __ls.context;`}
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
