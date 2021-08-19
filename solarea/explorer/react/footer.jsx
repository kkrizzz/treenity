add(() => (
  <footer className="bu-footer">
    <div className="bu-content bu-has-text-centered">
      <div className="bu-columns footer-logo-row">
        <div className="bu-column bu-is-6">
          <a className="footer-brand" href="/">
            <img
              className="footer-logo"
              src="/images/violet_grey_logo_velas.png"
              alt="Velas Mainnet"
            />
          </a>
        </div>
      </div>

      <div className="bu-columns">
        <div className="bu-column bu-is-12-mobile bu-is-3">
          <p className="footer-info-text"></p>
          <div className="footer-social-icons">
            <a
              href="http://github.com/velas/"
              rel="noreferrer"
              target="_blank"
              className="footer-social-icon"
              title="Github"
            >
              <i className="fab fa-github"></i>
            </a>
            <a
              href="https://twitter.com/VelasBlockchain"
              rel="noreferrer"
              target="_blank"
              className="footer-social-icon"
              title="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://t.me/VelasDevelopers"
              rel="noreferrer"
              target="_blank"
              className="footer-social-icon"
              title="Telegram"
            >
              <i className="fab fa-telegram-plane"></i>
            </a>
          </div>
        </div>

        <div className="col-xs-12 col-md-4 col-lg-3 footer-list">
          <h3>Velas</h3>
          <ul>
            <li>
              <a
                href="https://github.com/velas/Velas-Blockchain/issues"
                rel="noreferrer"
                className="footer-link"
                target="_blank"
              >
                Submit an Issue
              </a>
            </li>
            <li>
              <a
                href="https://github.com/velas/Velas-Blockchain"
                rel="noreferrer"
                className="footer-link"
                target="_blank"
              >
                Contribute
              </a>
            </li>
            <li>
              <a
                href="https://t.me/VelasDevelopers"
                rel="noreferrer"
                className="footer-link"
                target="_blank"
              >
                Chat
              </a>
            </li>
            <li>
              <a
                href="https://t.me/VelasDevelopers"
                rel="noreferrer"
                className="footer-link"
                target="_blank"
              >
                Support
              </a>
            </li>
          </ul>
        </div>
        <div className="col-xs-12 col-md-4 col-lg-3 footer-list">
          <h3>Other links</h3>
          <ul>
            <li>
              <a href="https://velas.com/" rel="noreferrer" className="footer-link" target="_blank">
                Velas
              </a>
            </li>
            <li>
              <a
                href="https://wallet.velas.com"
                rel="noreferrer"
                className="footer-link"
                target="_blank"
              >
                Web wallet
              </a>
            </li>
            <li>
              <a
                href="https://docs.next.velas.com/"
                rel="noreferrer"
                className="footer-link"
                target="_blank"
              >
                Documentation
              </a>
            </li>
          </ul>
        </div>

        <div className="col-xs-12 col-md-4 col-lg-3 footer-list">
          <h3>Main Networks</h3>
          <ul>
            <li>
              <a href="http://explorer.velas.com" rel="norefferer" className="footer-link">
                {' '}
                Velas{' '}
              </a>
            </li>
          </ul>
        </div>

        <div className="col-xs-12 col-md-4 col-lg-3 footer-list">
          <h3>Test Networks</h3>
          <ul>
            <li>
              <a href="http://explorer.testnet.velas.com" rel="noreferrer" className="footer-link">
                {' '}
                Velas Testnet{' '}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div>Version: v0.1</div>
    </div>
  </footer>
));
