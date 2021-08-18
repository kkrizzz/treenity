const TwoColumn = render('dev', 'two-column');
const RandomImageWithNonce = render('dev', 'random-image-with-nonce');
const Link = render('dev', 'link', 'react');

const { tokenRegExp } = await require('solarea://explorer/utils');

add(({ entityId }) => {
  const connection = solarea.useConnection();
  const isMainnet = connection._rpcEndpoint === 'https://mainnet.velas.com/rpc';

  const {
    data: accountTokens,
    isLoading: isAccountTokensLoading,
  } = solarea.useQuery('eth_acc_tokens', () =>
    globalThis
      .fetch(
        `https://${
          isMainnet ? 'evmexplorer.velas.com' : 'explorer.testnet.velas.com'
        }/api?module=account&action=tokenlist&address=${entityId}`,
      )
      .then((res) => res.json()),
  );

  const tokensUrl = isMainnet
    ? 'https://evmexplorer.velas.com/tokens?type=JSON'
    : 'https://explorer.testnet.velas.com/tokens?type=JSON';

  const { data: tokenData, isLoading: isTokenDataLoading } = solarea.useQuery(
    [isMainnet, 'tokendata_query', entityId],
    () => globalThis.fetch(tokensUrl).then((res) => res.json()),
  );

  if (isAccountTokensLoading || isTokenDataLoading) return <div>Loading ...</div>;

  console.log(tokenData);
  const parsedTokens = tokenData.items.map((tokenHtml, index) => {
    const [, name, address] = tokenRegExp.exec(tokenHtml);
    return { name, address };
  });

  return accountTokens.result.map((token) => {
    const tokenAddress = token.contractAddress;
    const tokenInfo = parsedTokens.find((i) => i.address === tokenAddress);
    return (
      <TwoColumn
        is={8}
        first={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                minWidth: 24,
                display: 'flex',
                alignItems: 'center',
                marginRight: 6,
              }}
            >
              <RandomImageWithNonce width={24} address={solarea.ethToVlx(tokenAddress)} />
            </div>
            <div>
              <Link to={`/address/${tokenAddress}`}>
                {tokenInfo ? tokenInfo.name : tokenAddress}
              </Link>
            </div>
          </div>
        }
        second={token.balance / Math.pow(10, token.decimals)}
      />
    );
  });
});
