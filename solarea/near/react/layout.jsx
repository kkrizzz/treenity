await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const { ThemeProvider } = solarea;
const { ConnectionProvider } = solarea.nearContext;
const Search = render('near', 'search');

add(({ children, query }) => {
  const [id, name, context] = solarea.useParams();

  if (['account', 'transaction', 'block'].includes(id)) {
    children = <Render {...query} entityId={name} id="near" context={context} name={id} />;
  }

  if (name === 'default')
    return (
      <ThemeProvider
        theme={{
          borderRadius: '12px',
          colors: {
            main: 'black',
            cardBG: 'var(--theme-card-bg-color)',
            subcardBG: 'var(--theme-subcard-bg-color)',
          },
        }}
      >
        <ConnectionProvider config="mainnet">
          <Render id={id} context={context} />
        </ConnectionProvider>
      </ThemeProvider>
    );

  return (
    <ThemeProvider
      theme={{
        borderRadius: '12px',
        colors: {
          main: 'black',
          cardBG: 'var(--theme-card-bg-color)',
          subcardBG: 'var(--theme-subcard-bg-color)',
        },
      }}
    >
      <ConnectionProvider config="mainnet">
        <div className="m-b-16">
          <Render id="near" name="layout-header" />
        </div>
        <div className="bu-container">
          <Render id="explorer" name="theme-css" />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ maxWidth: 400, minWidth: 350 }}>
              <Search />
            </div>
          </div>
          {children}
        </div>
      </ConnectionProvider>
    </ThemeProvider>
  );
});
