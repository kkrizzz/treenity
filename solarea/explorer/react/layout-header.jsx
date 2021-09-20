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
  ['Velas Mainnet', 'https://mainnet.velas.com/rpc'],
  ['Velas Testnet', 'https://testnet.velas.com/rpc'],
  ['Velas Devnet', 'https://devnet.velas.com/rpc'],

  // ['Solana Mainnet', 'mainnet-beta'],
  // ['Solana Testnet', 'testnet'],
  // ['Solana Devnet', 'devnet'],
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

  const clusterName = NETWORKS.find((n) => n[1] === clusterUrl)?.[0] || clusterUrl;
  const menuRef = React.useRef();

  return (
    <nav className="bu-navbar p-t-8 p-b-8" role="navigation" aria-label="main navigation">
      <div class="bu-container bu-is-max-desktop">
        <div className="bu-navbar-brand">
          <Link className="bu-navbar-item" to="/explorer" style={{ color: 'black' }}>
            <Render id="velas" name="logo" color="var(--theme-main-oposit-color)" />
          </Link>
          <Switch className="bu-navbar-item" value={isDarkTheme} onChange={setIsDarkTheme} />

          <a
            onClick={(e) => menuRef.current.classList.toggle('bu-is-active')}
            role="button"
            className="bu-navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="solarea-layout-header"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="solarea-layout-header" className="bu-navbar-menu" ref={menuRef}>
          <div className="bu-navbar-end">
            <NavLink className="bu-navbar-item" to="/explorer/tokens">
              Tokens
            </NavLink>
            <NavLink className="bu-navbar-item" to="/explorer/blocks?chain=evm">
              Blocks
            </NavLink>
            <div className="bu-navbar-item bu-is-hoverable">
              <div className="bu-navbar-link bu-is-primary bu-has-text-white bu-has-background-primary bu-has-text-weight-bold">
                {clusterName}
              </div>
              <div className="bu-navbar-item bu-navbar-dropdown bu-is-boxed">
                {NETWORKS.map(([name, url]) => (
                  <a onClick={setNetwork(url)} className="bu-navbar-item">
                    {name}
                  </a>
                ))}
                <div className="bu-navbar-item" style={{ display: 'flex' }}>
                  <input
                    id="cluster-url-input"
                    class="bu-input bu-is-small m-r-8"
                    style={{ minWidth: 200 }}
                    placeholder="Custom url"
                    ref={custom}
                    onKeyPress={(evt) => evt.code === 'Enter' && setCustomUrl()}
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
    </nav>
  );
});
