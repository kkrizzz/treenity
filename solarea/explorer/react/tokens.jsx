const BulmaCard = render('dev', 'bulma-card');
const Link = render('dev', 'link');

const { tokenRegExp } = await require('solarea://explorer/utils');

add(() => {
  const connection = solarea.useConnection();

  const isMainnet = connection._rpcEndpoint === 'https://mainnet.velas.com/rpc';
  const tokensUrl = isMainnet
    ? 'https://evmexplorer.velas.com/tokens?type=JSON'
    : 'https://explorer.testnet.velas.com/tokens?type=JSON';
  const { data: tokenData, isLoading } = solarea.useQuery([isMainnet, 'tokendata_query'], () =>
    globalThis.fetch(tokensUrl).then((res) => res.json()),
  );

  return (
    <Render id="explorer" name="layout">
      <div className="bu-container bu-is-max-desktop">
        {isLoading ? (
          <BulmaCard header="Loading token data . . ." />
        ) : (
          <div>
            {' '}
            <BulmaCard header="Tokens" />
            <BulmaCard>
              <div className="bu-columns bu-is-mobile">
                <div className="bu-column bu-is-1">№</div>
                <div className="bu-column bu-is-3">Token</div>
                <div className="bu-column bu-is-5">Address</div>
                <div className="bu-column bu-is-2">Supply</div>
                <div className="bu-column bu-is-1" style={{ textAlign: 'end' }}>
                  Holders
                </div>
              </div>
              {!isLoading &&
                tokenData.items.map((tokenHtml, index) => {
                  const [, tokenName, tokenAddress, tokenSupply, holdersCount] = tokenRegExp.exec(
                    tokenHtml,
                  );
                  return (
                    <div className="bu-columns bu-is-mobile">
                      <div className="bu-column bu-is-1">{index + 1}</div>
                      <div className="bu-column bu-is-3">{tokenName}</div>
                      <div className="bu-column bu-is-5 text-overflow">
                        <Link to={`/address/${tokenAddress}?chain=evm`}>{tokenAddress}</Link>
                      </div>
                      <div className="bu-column bu-is-2" style={{ textAlign: 'right' }}>
                        {parseFloat(tokenSupply.replace(/,/g, '')).toFixed(3)}
                      </div>
                      <div className="bu-column bu-is-1" style={{ textAlign: 'end' }}>
                        {holdersCount}
                      </div>
                    </div>
                  );
                })}
            </BulmaCard>
          </div>
        )}
      </div>
    </Render>
  );
});
