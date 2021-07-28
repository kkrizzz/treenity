// NavLink
// const { toast } = await require('solarea://explorer/toast/code');

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

  const custom = preact.useRef();
  const setCustomUrl = () => {
    const url = custom.current.value;
    if (url.startsWith('http')) {
      setCluster(url);
    } else {
      // toast('Wrong cluster url format, start from `http`')
    }
  };

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
                  <a onClick={setNetwork('mainnet-beta')} className="bu-navbar-item">
                    Solana Mainnet
                  </a>
                  <a onClick={setNetwork('testnet')} className="bu-navbar-item">
                    Solana Testnet
                  </a>
                  <a onClick={setNetwork('devnet')} className="bu-navbar-item">
                    Solana Devnet
                  </a>
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
