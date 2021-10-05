import React from 'react';

const counterAttr = 'counter';
function updateCounter(el, upd) {
  const value = el.dataset[counterAttr];
  el.dataset[counterAttr] = upd(value ? parseInt(value) : 0).toString();
}

const remover = (link) => () => {
  setTimeout(() => {
    const counter = link.dataset[counterAttr];
    if (+(counter || 0) > 1) {
      updateCounter(link, (count) => count - 1);
    } else {
      link.remove();
    }
  }, 500);
};

export const useCSS = (id, css) => {
  const [isReady, setIsReady] = React.useState(false);
  const linkRef = React.useRef<null | HTMLLinkElement>();

  React.useLayoutEffect(() => {
    setIsReady(false);

    const oldLink = document.querySelector(`link[id="${id}"]`);

    if (oldLink) {
      updateCounter(oldLink, (count) => count + 1);
      return remover(oldLink);
    }

    const cssBlob = new Blob([css], { type: 'text/css' });
    const cssBlobUrl = window.URL.createObjectURL(cssBlob);

    const oldLink = document.querySelector(`link[id="${id}"]`);

    if (oldLink) {
      // already added
      return;
    }

    let link = document.createElement('link');
    link.id = id;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.dataset[counterAttr] = '1';
    link.href = cssBlobUrl;
    if (typeof window !== 'undefined' && (window as any).chrome) {
      link.href += '#' + id;
    }

    document.head.appendChild(link);

    link.onload = function () {
      linkRef.current?.remove();
      linkRef.current = link;
      setIsReady(true);
    };

    return remover(link);
  }, [id, css]);

  return isReady;
};

export function css(strings: string[], ...args: any[]) {
  let str = strings[0];
  for (let i = 0; i < args.length; i++) {
    str += (args[i] || 'undefined').toString() + strings[i + 1];
  }
  return str;
}
