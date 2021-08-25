const themeCss = css`
  html {
    padding: 0;
    margin: 0;
    background: var(--theme-main-bg-color) !important;
  }
  .bu-tabs a {
    font-weight: 500;
    color: var(--theme-main-color);
    padding: 0.5em 0;
    margin-right: 2em;
  }
  .bu-tabs a:hover {
    border-bottom-color: var(--theme-tabs-color) !important;
    color: var(--theme-tabs-color) !important;
  }
  .bu-tabs li.bu-is-active a {
    border-bottom-color: var(--theme-tabs-active-color) !important;
    color: var(--theme-tabs-active-color) !important;
  }
  .bu-card {
    padding: 8px;
    width: inherit !important;
  }
  .bu-card-header {
    box-shadow: none !important;
  }

  .bu-card {
    color: var(--theme-main-color);
    background: var(--theme-card-bg-color);
    padding: 8px;
    box-shadow: none !important;
    width: inherit !important;
  }
  .bu-card-header-title {
    color: var(--theme-main-color);
  }
  .bu-card-header {
    box-shadow: none !important;
  }

  .bu-title {
    color: var(--theme-main-color);
  }
  .bu-subtitle {
    color: var(--theme-main-color);
  }

  .bu-tc-link {
    font-family: monospace;
    color: var(--theme-a-color);
    cursor: pointer;
  }
  .bu-tc-link:hover {
    color: var(--theme-a-hover-color);
  }
  .bu-tc-monospace {
    font-family: monospace;
  }
`;

const lightThemeVars = css`
  * {
    --theme-main-color: black;
    --theme-main-bg-color: white;

    --theme-tabs-color: #755cfd;
    --theme-tabs-active-color: #00d1b2;

    --theme-a-color: #00d1b2;
    --theme-a-hover-color: #00d1b2;

    --theme-card-bg-color: white;
  }
`;
const darkThemeVars = css`
  * {
    --theme-main-color: white;
    --theme-main-bg-color: #1c1d31;

    --theme-tabs-color: #00dfd1;
    --theme-tabs-active-color: #00ffd1;

    --theme-a-color: #00d1b2;
    --theme-a-hover-color: #00d1b2;

    --theme-card-bg-color: #282945;
  }
`;

add(() => {
  const [isDarkTheme] = solarea.useLocalStorageState('dark_theme', false);
  useCSS('theme-variables.css', isDarkTheme ? darkThemeVars : lightThemeVars);

  useCSS(
    'bulma-overrides.css',
    css`
      *,
      *::before,
      *::after {
        transition-property: background-color, color;
        transition-duration: 500ms, 100ms;
      }

      .container {
        padding: 0;
      }

      .flex-between {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .overflow-auto {
        overflow: auto;
        white-space: nowrap;
      }

      .overflow-hidden {
        overflow: hidden;
      }

      .text-overflow {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .solarea-tx-default_program-viewport {
        max-height: 500px;
        border-bottom: 1px solid #b9b9b9;
        margin-bottom: 24px;
      }
      @media screen and (max-width: 480px) {
        .column {
          font-size: 12pt !important;
        }
      }

      .m-b-8 {
        margin-bottom: 8px !important;
      }
      .m-b-16 {
        margin-bottom: 16px !important;
      }
      .m-t-8 {
        margin-top: 8px !important;
      }
      .m-t-16 {
        margin-top: 16px !important;
      }
      .m-r-8 {
        margin-right: 8px !important;
      }
      .m-r-16 {
        margin-right: 16px !important;
      }
      .m-l-8 {
        margin-left: 8px !important;
      }
      .m-l-16 {
        margin-left: 16px !important;
      }
      .p-t-16 {
        padding-top: 16px !important;
      }
      .p-t-8 {
        padding-top: 8px !important;
      }
      .p-b-16 {
        padding-bottom: 16px !important;
      }
      .p-b-8 {
        padding-bottom: 8px !important;
      }
      .m-16 {
        margin: 16px;
      }
      .m-t-32 {
        margin-top: 32px;
      }

      ${themeCss}
    `,
  );
  return null;
});
