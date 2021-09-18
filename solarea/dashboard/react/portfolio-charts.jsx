const { useNearTokens } = await require('solarea://near/utils');
const TokenChart = render('dev', 'tradingview-candles');

add(({ entityId }) => {
  const [tokens, isTokensLoading] = useNearTokens(entityId);
  useCSS(
    'near-nft-tokens.css',
    css`
      .near-portfolio-grid-50-item {
        -webkit-box-flex: 1;
        flex-grow: 1;
        flex-basis: 50%;
        max-width: 50%;
        padding: 1rem 0px;
        color: black;
        padding-right: 1rem;
      }
      .near-portfolio-grid-33-item {
        -webkit-box-flex: 1;
        flex-grow: 1;
        flex-basis: 50%;
        max-width: 50%;
        padding: 1rem 0px;
        color: black;
        padding-right: 1rem;
      }
      .near-portfolio-grid {
        display: flex;
        flex-flow: wrap;
        max-width: 100%;
      }
    `,
  );
  return (
    <div class="bu-columns" style={{ flexFlow: 'wrap' }}>
      {tokens &&
        tokens.map((tokenCollection) =>
          tokenCollection.tokens !== '0' ? (
            <div class="bu-column bu-is-6">
              <TokenChart contract={tokenCollection.contract} />
            </div>
          ) : null,
        )}
    </div>
  );
});
