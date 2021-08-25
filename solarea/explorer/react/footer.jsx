add(() => {
  useCSS(
    'footer.css',
    css`
      footer.bu-footer {
        background-color: #161623;
        line-height: 2rem;
        padding-top: 2rem;
      }
      footer h4 {
        font-weight: 700;
        color: white;
        font-size: 15px;
      }
      footer a {
        color: #65ceb3;
        font-size: 15px;
      }
      footer ul {
        list-style-type: none;
      }
    `,
  );

  return (
    <footer className="bu-footer">
      <div className="bu-container bu-is-max-desktop" style={{ padding: '0 2rem' }}>
        <div className="bu-columns">
          <div className="bu-column bu-is-12-mobile bu-is-4 bu-is-4-desktop footer-list">
            <h4>Velas</h4>
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
              <li>Version: v0.1</li>
            </ul>
          </div>
          <div className="bu-column bu-is-12-mobile bu-is-4 bu-is-4-desktop footer-list">
            <h4>Other links</h4>
            <ul>
              <li>
                <a
                  href="https://velas.com/"
                  rel="noreferrer"
                  className="footer-link"
                  target="_blank"
                >
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
                  href="https://docs.velas.com/"
                  rel="noreferrer"
                  className="footer-link"
                  target="_blank"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
          <div className="bu-column bu-is-12-mobile bu-is-4 bu-is-4-desktop footer-list">
            <h4>Networks</h4>
            <ul>
              <li>
                <a href="http://explorer.velas.com" rel="norefferer" className="footer-link">
                  Velas
                </a>
              </li>
              <li>
                <a
                  href="http://explorer.testnet.velas.com"
                  rel="noreferrer"
                  className="footer-link"
                >
                  Velas Testnet
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
});
