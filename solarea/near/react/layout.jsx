await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');

const { ConnectionProvider } = solarea.nearContext;

add(({ children }) => {
  return (
    <ConnectionProvider config="mainnet">
      <div className="m-b-16">
        <Render id="near" name="layout-header" />
      </div>
      <div className="bu-container bu-is-max-desktop">
        <Render id="explorer" name="theme-css" />
        <div className="m-b-16">
          <Render id="near" name="search" />
        </div>
        {children}
      </div>
    </ConnectionProvider>
  );
});
