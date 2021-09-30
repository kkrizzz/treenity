await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');

const { ThemeProvider } = solarea;
const Footer = render('io.solarea.velas', 'footer');
const Search = render('explorer', 'search');

add(({ id, children }) => {
  const [isDarkTheme] = solarea.useLocalStorageState('dark_theme', false);
  const ref = React.useRef(null);
  useCSS(
    'explorer-layout.css',
    css`
      .explorer-layout {
        flex-flow: nowrap;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      @media screen and (max-width: 1200px) {
        .p-8-mobile {
          padding: 8px;
        }
      }
      .bu-navbar-link:not(.bu-is-arrowless)::after {
        border-color: white !important;
      }
    `,
  );

  return (
    <div ref={ref}>
      <ThemeProvider
        theme={
          isDarkTheme
            ? {
                borderRadius: '12px',
                colors: {
                  main: 'white',
                  cardBG: 'var(--theme-card-bg-color)',
                  subcardBG: 'var(--theme-subcard-bg-color)',
                },
              }
            : {
                borderRadius: '12px',
                colors: {
                  main: 'black',
                  cardBG: 'var(--theme-card-bg-color)',
                  subcardBG: 'var(--theme-subcard-bg-color)',
                },
              }
        }
      >
        <Render id="explorer" name="theme-css" />
        <Render id={id} name="layout-header" />
        <div class="bu-container bu-is-max-desktop explorer-layout m-b-16 m-t-16">
          <Search />
        </div>
        {children}
        <div class="m-t-32">
          <Footer />
        </div>
      </ThemeProvider>
    </div>
  );
});
