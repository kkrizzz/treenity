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
    <nav className="bu-navbar p-t-8 p-b-8" role="navigation" aria-label="main navigation">
      <div class="bu-container">
        <div className="bu-navbar-brand">
          <Link
            className="bu-navbar-item"
            to="/"
            style={{
              color: 'var(--theme-main-oposit-color)',
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <Render id="velas" name="logo" />
            <div class="bu-is-size-6 bu-ml-2">DEXTOOLS</div>
          </Link>
          <Switch className="bu-navbar-item" value={isDarkTheme} onChange={setIsDarkTheme} />

          <a
            onClick={(e) => setIsActive((val) => !val)}
            role="button"
            style={{ marginLeft: 0 }}
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
          <div className="bu-navbar-end">
            <NavLink className="bu-navbar-item" to="/dashboard">
              Dashboard
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
});
