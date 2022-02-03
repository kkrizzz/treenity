import React, { FC } from 'react';

import baseStyled, {
  ThemedStyledInterface,
  ThemeProvider,
  css as basedCss,
} from 'styled-components';

export const solariaEditDarkTheme = {
  colors: {
    fill: {
      primary: '#17192F',
      secondary: '#1F2136',
      secondaryDark: '#1A1C31',
      secondaryLight: '#292B3D',
      gradient: 'linear-gradient(91.02deg, #FF0168 -0.37%, #FF9A01 97.19%)',
      gradientTransparent:
        'linear-gradient(91.02deg,#FF0168 -0.37%,rgb(255 154 1 / 28%) 67.19%, rgb(255 154 1 / 0%) 97.19%)',
    },
    text: {
      primary: '#F1F1F1',
      secondary: '#F1F1F180',
    },
  },
};

export type SolariaEditThemeType = typeof solariaEditDarkTheme;
export const styled = baseStyled as ThemedStyledInterface<SolariaEditThemeType>;
export const css = basedCss;

export const SolariaEditThemeProvider: FC = ({ children }) => {
  return <ThemeProvider theme={solariaEditDarkTheme}>{children}</ThemeProvider>;
};
