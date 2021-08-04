import React from 'react';

globalThis.useCSSprop = [];

// globalThis.removeAlluseCSSprop = () => {
//   globalThis.useCSSprop.forEach((link) => link.remove());
//   globalThis.useCSSprop = [];
// };

export const useCSS = (id, css) => {
  const [isReady, setIsReady] = React.useState(false);

  React.useLayoutEffect(() => {
    setIsReady(false);

    const cssBlob = new Blob([css], { type: 'text/css' });
    const cssBlobUrl = window.URL.createObjectURL(cssBlob);

    let link = document.createElement('link');
    link.id = id;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = cssBlobUrl + '#' + id;

    document.head.appendChild(link);
    globalThis.useCSSprop.push(link);

    link.onload = function () {
      setIsReady(true);
    };

    return () => {
      setTimeout(() => link.remove(), 0);
    };
  }, [id, css]);

  return isReady;
};
