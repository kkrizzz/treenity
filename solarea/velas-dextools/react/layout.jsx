await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');

add(({ children }) => {
  return (
    <div>
      <div className="m-b-16">
        <Render id="velas-dextools" name="layout-header" />
      </div>
      <div className="bu-container bu-is-max-desktop">
        <Render id="explorer" name="theme-css" />
        <div style={{ marginBottom: 32 }}>
          <Render id="velas-dextools" name="search" />
        </div>
        {children}
      </div>
    </div>
  );
});
