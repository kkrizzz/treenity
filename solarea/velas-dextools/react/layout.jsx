await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const RandomImageWithNonce = render('dev', 'random-image-with-nonce');

add(({ children }) => {
  return (
    <div>
      <div className="m-b-8">
        <Render id="velas-dextools" name="layout-header" />
      </div>
      <div className="bu-container">
        <Render id="explorer" name="theme-css" />
        <div class="bu-mb-3">
          <Render id="velas-dextools" name="search" />
        </div>
        {children}
      </div>
    </div>
  );
});
