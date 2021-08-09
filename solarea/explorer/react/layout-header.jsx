// NavLink
const { toast } = await require('solarea://dev/toast');

function NavLink({ to, children, className = '' }) {
  const active = window.location.href.endsWith(to);
  const go = (env) => {
    env.preventDefault();
    window.history.pushState({}, '', to);
  };

  return (
    <a onClick={go} href={to} className={className + (active ? ' is-active' : '')}>
      {children}
    </a>
  );
}
const Link = render('dev', 'link');
const Switch = render('dev', 'switch');

const NETWORKS = [
  ['Velas', 'https://mainnet.velas.com/rpc'],
  ['Velas Testnet', 'https://testnet.velas.com/rpc'],
  ['Solana Mainnet', 'mainnet-beta'],
  ['Solana Testnet', 'testnet'],
  ['Solana Devnet', 'devnet'],
];

add(() => {
  const [, clusterUrl, setCluster] = solarea.useCluster();
  const setNetwork = (url) => () => setCluster(url);
  const [isDarkTheme, setIsDarkTheme] = solarea.useLocalStorageState('dark_theme', false);

  const custom = preact.useRef();
  const setCustomUrl = () => {
    const url = custom.current.value;
    if (url.startsWith('http')) {
      setCluster(url);
    } else {
      toast('Wrong cluster url format, should start with `http`', 3000, '#f14668');
    }
  };

  return (
    <nav className="bu-navbar p-t-8 p-b-8" role="navigation" aria-label="main navigation">
      <div class="bu-container bu-is-max-desktop">
        <div className="bu-navbar-brand">
          <Link className="bu-navbar-item" to="/explorer">
            <Render id="velas" name="logo" />
          </Link>

          <a
            role="button"
            className="bu-navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="bu-navbar-menu">
          <div className="bu-navbar-end">
            <Switch value={isDarkTheme} onChange={setIsDarkTheme}>
              {isDarkTheme ? '🌙' : '☀'}️
            </Switch>
            <NavLink className="bu-navbar-item bu-is-tab" to="/explorer/tokens">
              Tokens
            </NavLink>
            <NavLink className="bu-navbar-item bu-is-tab" to="/explorer/blocks?chain=evm">
              Blocks
            </NavLink>
            <NavLink className="bu-navbar-item bu-is-tab" to="/explorer/transactions">
              Transactions
            </NavLink>
            <div className="bu-navbar-item bu-has-dropdown bu-is-hoverable">
              <div className="bu-buttons">
                <a className="bu-button bu-is-primary">
                  <strong>{clusterUrl}</strong>
                </a>

                <div className="bu-navbar-dropdown">
                  {NETWORKS.map(([name, url]) => (
                    <a onClick={setNetwork(url)} className="bu-navbar-item">
                      {name}
                    </a>
                  ))}
                  <div className="bu-navbar-item bu-is-align-items-center">
                    <input
                      id="cluster-url-input"
                      class="bu-input bu-is-small m-r-8"
                      style={{ minWidth: 200 }}
                      placeholder="Custom url"
                      ref={custom}
                    />
                    <a
                      class="bu-button bu-is-small bu-is-primary"
                      style={{ marginBottom: 0 }}
                      onClick={setCustomUrl}
                    >
                      Set
                    </a>
                  </div>
                  <hr className="bu-navbar-divider">
                    <a className="bu-navbar-item">Report an issue</a>
                  </hr>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});
