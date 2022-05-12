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

export function minify(strs, ...objs) {
  let res = strs[0];
  for (let i = 0; i < objs.length; i++) {
    res += objs[i].toString() + strs[i + 1];
  }
  return res.trim().split('\n').join(' ');
}
