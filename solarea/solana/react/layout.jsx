await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');

const ThemeProvider = render('explorer', 'theme-provider');
const Footer = render('io.solarea.velas', 'footer');
const Search = render('explorer', 'search');

add(({ id, children }) => {
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
    <ThemeProvider>
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
  );
});
