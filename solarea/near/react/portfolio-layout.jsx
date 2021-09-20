const { ConnectionProvider } = solarea.nearContext;
await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');

add(({ children }) => {
  return (
    <ConnectionProvider config="mainnet">
      <div class="bu-container bu-is-max-desktop">
        <Render id="near" name="portfolio-layout-header" />
        <div class="m-b-16">
          <Render id="near" name="search" />
        </div>
        <Render id="explorer" name="theme-css" />
        {children}
      </div>
    </ConnectionProvider>
  );
});
