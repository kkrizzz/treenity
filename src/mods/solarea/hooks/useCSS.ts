import React from 'react';

globalThis.useCSSprop = [];

// globalThis.removeAlluseCSSprop = () => {
//   globalThis.useCSSprop.forEach((link) => link.remove());
//   globalThis.useCSSprop = [];
// };

export const useCSS = (id, css) => {
  const [isReady, setIsReady] = React.useState(false);
  const linkRef = React.useRef<null | HTMLLinkElement>();

  React.useLayoutEffect(() => {
    setIsReady(false);

    const cssBlob = new Blob([css], { type: 'text/css' });
    const cssBlobUrl = window.URL.createObjectURL(cssBlob);

    let link = document.createElement('link');
    link.id = id;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = cssBlobUrl;
    if (typeof window !== 'undefined' && (window as any).chrome) {
      link.href += '#' + id;
    }

    document.head.appendChild(link);

    // globalThis.useCSSprop.push(link);

    link.onload = function () {
      linkRef.current?.remove();
      linkRef.current = link;
      setIsReady(true);
    };

    return () => {
      setTimeout(() => {
        link.remove();
      }, 500);
    };
  }, [id, css]);

  return isReady;
};
