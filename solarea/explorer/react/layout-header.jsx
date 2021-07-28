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
  const [, clusterUrl, setCluster] = solarea.useCluster();

  const setNetwork = (url) => () => setCluster(url);

  return (
    <nav className="bu-navbar p-t-8 p-b-8" role="navigation" aria-label="main navigation">
      <div class="bu-container bu-is-max-desktop">
        <div className="bu-navbar-brand">
          <a className="bu-navbar-item" href="https://explorer.velas.com">
            <Render id="velas" name="logo" />
          </a>

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
            <NavLink className="bu-navbar-item bu-is-tab" to="/explorer/cluster">
              Cluster stats
            </NavLink>
            <NavLink className="bu-navbar-item bu-is-tab" to="/explorer/supply">
              Supply
            </NavLink>

            <div className="bu-navbar-item bu-has-dropdown bu-is-hoverable">
              <div className="bu-buttons">
                <a className="bu-button bu-is-primary">
                  <strong>{clusterUrl}</strong>
                </a>
                <div className="bu-navbar-dropdown">
                  <a onClick={setNetwork('mainnet-beta')} className="bu-navbar-item">
                    Mainnet
                  </a>
                  <a onClick={setNetwork('testnet')} className="bu-navbar-item">
                    Testnet
                  </a>
                  <a onClick={setNetwork('devnet')} className="bu-navbar-item">
                    Devnet
                  </a>
                  <a
                    onClick={setNetwork('https://mainnet.velas.com/rpc')}
                    className="bu-navbar-item"
                  >
                    Velas
                  </a>
                  <a
                    onClick={setNetwork('https://testnet.velas.com/rpc')}
                    className="bu-navbar-item"
                  >
                    Velas Testnet
                  </a>
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
