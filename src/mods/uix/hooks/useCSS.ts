import React from 'react';
import { addStyle, removeStyle } from '../utils/GlobalCSSRender';
globalThis.useCSSprop = [];

export const useCSS = (id, css) => {
  React.useLayoutEffect(() => {
    addStyle(css, id);
    return () => removeStyle(id);
  }, [id, css]);
};

export function css(strings: string[], ...args: any[]) {
  let str = strings[0];
  for (let i = 0; i < args.length; i++) {
    str += (args[i] || 'undefined').toString() + strings[i + 1];
  }
  return str;
}
