const {
  useAccount: useNearAccount,
  nearHumanBalance,
  useNearNFT,
  useNearAccTransactions,
  useNearTokens,
} = await require('solarea://near/utils');
const DashboardSection = render('dev', 'dashboard-section');

const TokenAmountPrice = render('dashboard', 'token-amount-price');
const AccountBalance = render('dashboard', 'account-balance');
const TokenPrice = render('dashboard', 'token-price');
const PortfolioNft = render('dashboard', 'portfolio-nft');
const TokenChart = render('dev', 'tradingview-candles');

const tokensDecimalsPow = (amount, decimals, toFixed = 4) =>
  (amount * Math.pow(10, -decimals)).toFixed(toFixed);

add(({ entityId }) => {
  const [tokens, isTokensLoading] = useNearTokens(entityId);
  if (isTokensLoading && !tokens) return 'Loading your portfolio...';

  return (
    <div style={{ marginTop: 10 }}>
      <DashboardSection title="Watchlist">
        <div class="bu-columns">
          <div class="bu-column">
            <TokenPrice contract="c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.factory.bridge.near" />
          </div>
          <div class="bu-column">
            <TokenPrice contract="token.skyward.near" />
          </div>
        </div>
      </DashboardSection>
      <TokenChart contract="token.skyward.near" />
      <DashboardSection title="Token balances">
        <div class="bu-columns">
          <div className="bu-column">
            <AccountBalance entityId={entityId} />
          </div>
          {tokens &&
            tokens.map((tokenCollection) =>
              tokenCollection.tokens !== '0' ? (
                <div class="bu-column">
                  <TokenAmountPrice
                    contract={tokenCollection.contract}
                    amount={tokensDecimalsPow(
                      tokenCollection.tokens,
                      tokenCollection.metadata.decimals,
                    )}
                  />
                </div>
              ) : null,
            )}
        </div>
      </DashboardSection>
      <DashboardSection title="NFT gallery">
        <div class="bu-columns">
          <div class="bu-column">
            <PortfolioNft entityId={entityId} />
          </div>
        </div>
      </DashboardSection>
    </div>
  );
});
