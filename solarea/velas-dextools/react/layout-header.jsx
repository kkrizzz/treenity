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
  const [isDarkTheme, setIsDarkTheme] = solarea.useLocalStorageState('dark_theme', false);
  const menuRef = React.useRef();
  const [isActive, setIsActive] = React.useState(false);
  return (
    <nav
      className="bu-navbar p-t-8 p-b-8"
      role="navigation"
      aria-label="main navigation"
      style={{ background: 'var(--theme-card-bg-color)' }}
    >
      <div class="bu-container bu-is-max-widescreen">
        <div className="bu-navbar-brand">
          <div className="bu-navbar-item" style={{ alignItems: 'flex-end' }}>
            <Link
              to="/"
              style={{
                color: 'var(--theme-main-oposit-color)',
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <Render id="velas" name="logo" />
            </Link>
            <Link
              to="https://defi.parts"
              style={{
                color: 'var(--theme-main-oposit-color)',
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <div className="bu-is-size-6 bu-ml-2" style={{ color: 'var(--theme-a-hover-color)' }}>
                .defi.parts
              </div>
            </Link>
          </div>
          <a
            onClick={(e) => setIsActive((val) => !val)}
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
        <div
          id="solarea-layout-header"
          className={`bu-navbar-menu ${isActive ? 'bu-is-active' : ''}`}
        >
          <div className="bu-navbar-end" style={{ alignItems: 'center' }}>
            <Link
              to="https://twitter.com/defiparts"
              type="custom"
              target="_blank"
              style={{
                height: 'fit-content',
                marginLeft: '1rem',
                marginRight: 8,
                color: isDarkTheme ? 'white' : 'black',
              }}
            >
              <Render id="icons" name="twitter" />
            </Link>
            <Link
              to="https://t.me/defiparts_chat"
              type="custom"
              target="_blank"
              style={{
                color: isDarkTheme ? 'white' : 'black',
                height: 'fit-content',
                marginRight: 16,
              }}
            >
              <Render id="icons" name="telegram" />
            </Link>
            <NavLink className="bu-navbar-item" to="/dashboard">
              Dashboard
            </NavLink>
            <NavLink className="bu-navbar-item">
              <Switch value={isDarkTheme} onChange={setIsDarkTheme}>
                <div style={{ marginTop: 2 }}>{isDarkTheme ? '🌙' : '☀️️'}️</div>
              </Switch>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
});
