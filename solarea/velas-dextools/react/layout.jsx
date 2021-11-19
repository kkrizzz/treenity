await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const RandomImageWithNonce = render('dev', 'random-image-with-nonce');
const ThemeProvider = render('velas-dextools', 'theme-provider');

add(({ children }) => {
  const [isDarkTheme] = solarea.useLocalStorageState('dark_theme', false);
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

      @media screen and (min-width: 1216px) {
        .bu-container:not(.bu-is-max-desktop) {
          max-width: 1620px;
        }
      }
    `,
  );

  const [id, name, contexts] = solarea.useParams();
  if (id.length === 42 && id.startsWith('0x')) {
    children = <Render id="velas-dextools" name="dextools" token={id} />;
  } else if (id === 'dashboard') {
    children = <Render id="velas-dextools" name="dashboard" dashboardName={name} />;
  }

  return (
    <ThemeProvider>
      <div style={{ marginBottom: 24 }}>
        <Render id="velas-dextools" name="layout-header" />
      </div>
      <div className="bu-container bu-is-max-widescreen">
        <div style={{ marginBottom: 36 }}>
          <Render id="velas-dextools" name="search" />
        </div>
        {children}
      </div>
    </ThemeProvider>
  );
});
