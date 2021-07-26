// NavLink
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

add(() => {
  return (
    <nav className="navbar m-t-8" role="navigation" aria-label="main navigation">
      <div class="container is-max-desktop">
        <div className="navbar-brand">
          <a className="navbar-item" href="https://explorer.velas.com">
            <Render id="velas" name="logo" />
          </a>

          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-end">
            <NavLink className="navbar-item is-tab" to="/explorer/cluster">
              Cluster stats
            </NavLink>
            <NavLink className="navbar-item is-tab" to="/explorer/supply">
              Supply
            </NavLink>

            <div className="navbar-item has-dropdown is-hoverable">
              <div className="buttons">
                <a className="button is-primary">
                  <strong>Mainnet</strong>
                </a>
                <div className="navbar-dropdown">
                  <a className="navbar-item">Mainnet</a>
                  <a className="navbar-item">Testnet</a>
                  <a className="navbar-item">Devnet</a>
                  <hr className="navbar-divider">
                    <a className="navbar-item">Report an issue</a>
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
