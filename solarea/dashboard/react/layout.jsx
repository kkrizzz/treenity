await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
require('https://fonts.googleapis.com/css?family=Roboto%20Mono&.css');
require('https://fonts.googleapis.com/css?family=Roboto&.css');

const { ConnectionProvider } = solarea.nearContext;

add(({ children }) => {
  return (
    <ConnectionProvider config="mainnet">
      <div className="bu-container bu-is-max-desktop">
        <Render id="explorer" name="theme-css" />
        <Render id="dashboard" name="theme" />
        {children}
      </div>
    </ConnectionProvider>
  );
});
