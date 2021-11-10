import React, { useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';

type Style = { css: string; id: string; count: number };

const globalStyles: Style[] = [];
let updateGlobalStyles: (() => void) | null = null;

export const addStyle = (css: string, id: string) => {
  const styleIndex = globalStyles.findIndex((style) => style.id === id);
  if (styleIndex !== -1) {
    globalStyles[styleIndex].count++;
    return;
  }

  console.log(globalStyles.length, '---- add ' + id);

  globalStyles.push({ css, id, count: 1 });
  if (updateGlobalStyles) updateGlobalStyles();
  else console.error('updateGlobalStyles is null');
};

export const removeStyle = (id: string) => {
  const styleIndex = globalStyles.findIndex((style) => style.id === id);
  if (!styleIndex) return;
  if (--globalStyles[styleIndex].count === 0) {
    console.log(globalStyles.length, '---- remove ', id);

    globalStyles.splice(styleIndex, 1);
    if (updateGlobalStyles) updateGlobalStyles();
    else console.error('updateGlobalStyles is null');
  } else
    console.log(
      globalStyles.length,
      '---- decrease ' + id,
      ' - count: ' + globalStyles[styleIndex].count,
    );
};

const GlobalStyle = createGlobalStyle`
  ${(p) => p.css}
`;

export const GlobalCSSRender = () => {
  const [, update] = React.useState(0);

  useEffect(() => {
    updateGlobalStyles = () => update((v) => v + 1);
  }, []);

  return (
    <>
      {globalStyles.map((style) => (
        <GlobalStyle css={style.css} />
      ))}
    </>
  );
};

globalThis.CSSProvider = GlobalCSSRender;
