await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const RandomImageWithNonce = render('dev', 'random-image-with-nonce');
const ThemeProvider = render('velas-dextools', 'theme-provider');

add(({ children }) => {
  useCSS(
    'velas-dextools.css',
    css`
      .bu-navbar-item,
      .bu-navbar-link {
        color: var(--theme-main-oposit-color) !important;
        font-weight: 600;
        font-size: 16px;
      }
      a.bu-navbar-item:hover,
      a.bu-navbar-item:focus {
        background: transparent !important;
        color: var(--theme-a-color) !important;
      }

      @media screen and (min-width: 1620px) {
        .bu-container:not(.bu-is-max-desktop) {
          max-width: 1620px;
        }
      }
      @media screen and (min-width: 1216px) {
        .bu-container:not(.bu-is-max-desktop) {
          max-width: calc(100vw - 100px);
        }
      }

      @media screen and (max-width: 1024px) {
        .bu-container:not(.bu-is-max-desktop) {
          max-width: calc(100vw - 32px);
        }
      }
    `,
  );

  return <ThemeProvider>{children}</ThemeProvider>;
});
