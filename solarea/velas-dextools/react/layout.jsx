await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const RandomImageWithNonce = render('dev', 'random-image-with-nonce');
const { ThemeProvider } = solarea;

add(({ children }) => {
  const [isDarkTheme] = solarea.useLocalStorageState('dark_theme', false);
  useCSS(
    'velas-dextools.css',
    css`
      * {
        --tv-color-platform-background: black !important;
      }

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
    `,
  );

  const [id, name, contexts] = solarea.useParams();
  if (id.length === 42 && id.startsWith('0x')) {
    children = <Render id="velas-dextools" name="dextools" token={id} />;
  } else if (id === 'dashboard') {
    children = <Render id="velas-dextools" name="dashboard" dashboardName={name} />;
  }

  return (
    <ThemeProvider
      theme={
        isDarkTheme
          ? {
              borderRadius: '12px',
              colors: {
                main: 'white',
                subcardBG: 'var(--theme-subcard-bg-color)',
                cardBG: 'var(--theme-card-bg-color)',
                wagyuswapLinkColor: 'white',
                wagyuswapLinkBg: '#1b2845',
              },
            }
          : {
              borderRadius: '12px',
              colors: {
                main: 'black',
                subcardBG: '#f8faff',
                cardBG: '#ffffff',
                wagyuswapLinkColor: 'blackr',
                wagyuswapLinkBg: 'white',
              },
            }
      }
    >
      <div className="m-b-8">
        <Render id="velas-dextools" name="layout-header" />
      </div>
      <div className="bu-container" style={{ overflowX: 'hidden' }}>
        <Render id="explorer" name="theme-css" />
        <div class="bu-mb-5">
          <Render id="velas-dextools" name="search" />
        </div>
        {children}
      </div>
    </ThemeProvider>
  );
});
