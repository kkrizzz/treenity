require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');

const Footer = render('velas', 'footer');
const Search = render('explorer', 'search');
const ThemeProvider = render('explorer', 'theme-provider');
const ConnectionProvider = solarea.ConnectionProvider;

add(({ query, children }) => {
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

  const [id, name, context] = solarea.useParams();

  if (['address', 'tx', 'block'].includes(id)) {
    children = <Render {...query} entityId={name} id="explorer" context={context} name={id} />;
  }

  return (
    <ConnectionProvider cluster="https://mainnet.velas.com/rpc">
      <ThemeProvider>
        <Render id="explorer" name="theme-css" />
        <Render id="velas" name="layout-header" />
        <div class="bu-container bu-is-max-desktop explorer-layout m-b-16 m-t-16">
          <Search />
        </div>
        {children}
        <div class="m-t-32">
          <Footer />
        </div>
      </ThemeProvider>
    </ConnectionProvider>
  );
});
