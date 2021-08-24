const TwoColumn = render('dev', 'two-column');
const Link = render('dev', 'link');
const RandomImageWithNonce = render('dev', 'random-image-with-nonce');

add(({ entityId }) => {
  const [tokensResult, isTokensLoading] = solarea.useSolanaRpc('getTokenAccountsByOwner', [
    entityId,
    { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
    { encoding: 'jsonParsed', commitment: 'processed' },
  ]);

  if (isTokensLoading) return <div>Loading . . . </div>;
  const tokens = tokensResult.value;

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

  if (isDataLoading) return <div>Loading . . . </div>;

  const tokensMint = tokenData.data.tokens;

  return (
    <div>
      {tokens.map((token) => {
        const info = token.account.data.parsed.info;
        const tokenInfo = tokensMint.find((t) => t.address === info.mint);
        const amount = info.tokenAmount.uiAmountString;
        return (
          <div>
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
                    {tokenInfo?.logoURI ? (
                      <img
                        style={{ width: 24, height: 24 }}
                        src={tokenInfo.logoURI}
                        alt="Placeholder image"
                      />
                    ) : (
                      <RandomImageWithNonce width={24} address={info.mint} />
                    )}
                  </div>
                  <div>
                    <Link to={`/address/${info.mint}`}>{tokenInfo?.name || info.mint}</Link>
                  </div>
                </div>
              }
              second={`${amount} ${tokenInfo?.symbol || ''}`}
            />
          </div>
        );
      })}
      {!tokens.length && <div>No tokens</div>}
    </div>
  );
});
