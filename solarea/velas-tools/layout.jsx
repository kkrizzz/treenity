await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const RandomImageWithNonce = render('dev', 'random-image-with-nonce');
const { ThemeProvider } = solarea;

add(({ children }) => {
  useCSS(
    'velas-dextools.css',
    css`
      --tv-color-platform-background: black;
    `,
  );
  return (
    <ThemeProvider
      theme={{
        borderRadius: '12px',
        colors: {
          main: 'black',
          subcardBG: '#f8faff',
          cardBG: '#ffffff',
        },
      }}
    >
      <div className="m-b-8">
        <Render id="velas-dextools" name="layout-header" />
      </div>
      <div className="bu-container">
        <Render id="explorer" name="theme-css" />
        <div class="bu-mb-5">
          <Render id="velas-dextools" name="search" />
        </div>
        {children}
      </div>
    </ThemeProvider>
  );
});
