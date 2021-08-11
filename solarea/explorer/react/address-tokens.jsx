const TwoColumn = render('dev', 'two-column');
const Link = render('dev', 'link');

add(({ entityId }) => {
  const [tokens, isTokensLoading] = solarea.useSolanaRpc(
    'getTokenAccountsByOwner',
    entityId,
    { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
    { encoding: 'jsonParsed', commitment: 'processed' },
  );

  if (isTokensLoading) return 'Loading...';

  // prettier-ignore
  const [tokenData, isDataLoading] = solarea.useGraphQL('/solana/tokens', `{
    tokens: allTokens(filter: {
      chainId: 101, 
      address_ar: ${JSON.stringify(tokens.map(token => token.account.data.parsed.info.mint))}}
    ) {
      chainId 
      address
      logoURI
      symbol
      name
      decimals
      tags
      extensions
    }
  }`);

  if (isDataLoading) return 'Loading...';

  const tokensMint = tokenData.data.tokens;

  return (
    <div>
      {tokens.map((token) => {
        const info = token.account.data.parsed.info;
        const tokenInfo = tokensMint.find((t) => t.address === info.mint);
        const amount = info.tokenAmount.uiAmountString;
        return tokenInfo ? (
          <TwoColumn
            first={
              <Link to={`/address/${info.mint}`}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={tokenInfo.logoURI} style={{ width: 24, height: 24, marginRight: 6 }} />{' '}
                  {tokenInfo.name}
                </div>
              </Link>
            }
            second={`${amount} ${tokenInfo.symbol}`}
          />
        ) : (
          <TwoColumn
            first={<Link to={`/address/${info.mint}`}>{info.mint}</Link>}
            second={amount}
          />
        );
      })}
    </div>
  );
});
