function NavLink({ to, className }) {
  window.location.

  return <a className="navbar-item is-tab">Supply</a>

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
            <a className="navbar-item is-tab">Cluster stats</a>

            <a className="navbar-item is-tab">Supply</a>

            <div className="navbar-item has-dropdown is-hoverable">
              <div className="buttons">
                <a className="button is-primary">
                  <strong>Mainnet</strong>
                </a>
                <div className="navbar-dropdown">
                  <a className="navbar-item">About</a>
                  <a className="navbar-item">Jobs</a>
                  <a className="navbar-item">Contact</a>
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
