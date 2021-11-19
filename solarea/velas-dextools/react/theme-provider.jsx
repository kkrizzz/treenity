const { ThemeProvider } = solarea;

const lightThemeVars = css`
  * {
    --theme-main-color: black;
    --theme-main-bg-color: #e5e5e5;
    --theme-main-oposit-color: rgb(12, 25, 55);
    --theme-main-content-color: #a1aab3;
    --theme-main-border-color: #ebebeb;

    --theme-tabs-color: #5ea7de;
    --theme-tabs-active-color: #5ea7de;

    --theme-a-color: #4b91ca;
    --theme-a-hover-color: #68a3d3;

    --theme-card-bg-color: white;
    --theme-subcard-bg-color: white;

    --theme-card-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0px 0 1px rgb(10 10 10 / 2%);
    --theme-success-color: #43cda4;
    --theme-success-secondary-color: #26a69a;
    --theme-error-color: #e34c5e;
    --theme-error-secondary-color: #f76e64;

    --theme-wagyuswap-link-color: black;
    --theme-wagyuswap-link-bg-color: white;

    --theme-switch-bg-color: #dddddd;
  }
`;

const darkThemeVars = css`
  * {
    --theme-main-color: white;
    --theme-main-bg-color: #0e1621;
    --theme-main-oposit-color: white;
    --theme-main-content-color: #7e8e9d;
    --theme-main-border-color: #0e1621;

    --theme-tabs-color: #c0cdde;
    --theme-tabs-active-color: #c0cdde;

    --theme-a-color: #4b91ca;
    --theme-a-hover-color: #68a3d3;

    --theme-card-bg-color: #17212b;
    --theme-subcard-bg-color: #182633;

    --theme-card-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0px 0 1px rgb(10 10 10 / 2%);
    --theme-success-color: #1ace98;
    --theme-success-secondary-color: #89eed0;
    --theme-error-color: #e34c5e;
    --theme-error-secondary-color: #ffafaf;

    --theme-wagyuswap-link-color: white;
    --theme-wagyuswap-link-bg-color: #273249;

    --theme-switch-bg-color: #2d6ea4;
  }
`;

const theme = {
  borderRadius: '12px',
  fontSize: {
    xsmall: '14px',
    small: '16px',
    medium: '20px',
    large: '40px',
  },
  colors: {
    main: 'var(--theme-main-color)',
    subcardBG: 'var(--theme-subcard-bg-color)',
    secondaryContent: 'var(--theme-main-content-color)',
    cardBG: 'var(--theme-card-bg-color)',
    border: 'var(--theme-main-border-color)',
    linkColor: 'var(--theme-a-color)',
    hoverLinkColor: 'var(--theme-a-hover-color)',
    wagyuswapLinkColor: 'var(--theme-wagyuswap-link-color)',
    wagyuswapLinkBg: 'var(--theme-wagyuswap-link-bg-color)',
    success: 'var(--theme-success-color)',
    error: 'var(--theme-error-color)',
  },
  addOpacity: (color, opacity) => {
    let c = color;
    if (c.includes('var')) {
      const style = getComputedStyle(document.body);
      c = style.getPropertyValue(c.replace('var(', '').replace(')', ''));
    }
    return `${c}${Math.round((opacity / 100) * 255).toString(16)}`;
  },
};

const CustomThemeProvider = ({ children }) => {
  const [isDarkTheme] = solarea.useLocalStorageState('dark_theme', false);

  return (
    <ThemeProvider theme={theme}>
      <Render
        id="explorer"
        name="theme-css"
        customThemeVars={isDarkTheme ? darkThemeVars : lightThemeVars}
      />
      {children}
    </ThemeProvider>
  );
};
add(CustomThemeProvider);
