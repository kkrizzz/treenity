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
  const menuRef = React.useRef();

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
      </div>
    </nav>
  );
});
