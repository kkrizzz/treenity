require('https://fonts.googleapis.com/css?family=Roboto%20Mono&.css');
require('https://fonts.googleapis.com/css?family=Roboto&.css');
// require('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&family=Ubuntu:wght@400;500;700&display=swap&.css');
const themeCss = css`
  * {
    --theme-font-monospace: 'Roboto Mono';
    --theme-font: 'Roboto';
  }

  html,
  body,
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: var(--theme-font);
    font-weight: 400;
    line-height: 1.333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

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
    box-shadow: var(--theme-card-shadow) !important;
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
    font-family: var(--theme-font-monospace);
    color: var(--theme-a-color);
    cursor: pointer;
  }

  .bu-tc-link:hover {
    color: var(--theme-a-hover-color);
  }

  .bu-monospace {
    font-family: var(--theme-font-monospace);
  }

  .theme-inner-instruction {
    background-color: var(--theme-inner-card-bg);
    color: var(--theme-inner-card-color);
  }

  strong {
    color: var(--theme-main-color);
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
    --theme-subcard-bg-color: #fafafa;
    --theme-card-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0px 0 1px rgb(10 10 10 / 2%);

    --theme-success-color: #00d1b2;
    --theme-error-color: red;

    --theme-inner-card-color: var(--theme-main-color);
    --theme-inner-card-bg: #f3f3f3;

    --theme-logs-color: white;
    --theme-logs-bg: #232323;

    --theme-footer-bg: #00000006;

    --theme-table-strip-color: #fafafa;
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
    --theme-card-shadow: none;

    --theme-inner-card-color: var(--theme-main-color);
    --theme-inner-card-bg: #353550;

    --theme-success-color: #00d1b2;
    --theme-error-color: red;

    --theme-logs-color: white;
    --theme-logs-bg: #1c1d31;

    --theme-footer-bg: #0000001c;
  }
`;

const newDarkThemeVars = css`
  * {
    --theme-main-color: white;
    --theme-main-bg-color: rgb(12, 25, 55);

    --theme-tabs-color: #0b74ff;
    --theme-tabs-active-color: #398dfd;

    --theme-a-color: #0b74ff;
    --theme-a-hover-color: #398dfd;

    --theme-card-bg-color: #1b2845;
    --theme-subcard-bg-color: #273555;
    --theme-card-shadow: none;

    --theme-inner-card-color: var(--theme-main-color);
    --theme-inner-card-bg: #353550;

    --theme-success-color: #00c164;
    --theme-error-color: #ff003d;

    --theme-logs-color: white;
    --theme-logs-bg: #1c1d31;

    --theme-footer-bg: #0000001c;
  }
`;

add(() => {
  const [isDarkTheme] = solarea.useLocalStorageState('dark_theme', false);
  useCSS('theme-variables.css', isDarkTheme ? newDarkThemeVars : lightThemeVars);

  useCSS(
    'bulma-overrides.css',
    css`
      *,
      *::before,
      *::after {
        transition-property: background-color, color;
        transition-duration: 250ms, 50ms;
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

      .spinner-grow {
        display: inline-block;
        width: 1.1rem;
        height: 1.1rem;
        vertical-align: text-bottom;
        background-color: currentColor;
        border-radius: 50%;
        opacity: 0;
        -webkit-animation: spinner-grow 0.75s linear infinite;
        animation: spinner-grow 0.75s linear infinite;
      }

      @keyframes spinner-grow {
        0% {
          transform: scale(0);
        }
        50% {
          opacity: 1;
          transform: none;
        }
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

      .m-r-4 {
        margin-right: 4px;
      }

      ${themeCss}
    `,
  );
  return null;
});
