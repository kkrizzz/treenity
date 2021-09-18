const {
  useAccount: useNearAccount,
  nearHumanBalance,
  useNearNFT,
  useNearAccTransactions,
  useNearTokens,
  useNearPortfolioBalance,
} = await require('solarea://near/utils');
const DashboardSection = render('dev', 'dashboard-section');

const TokenAmountPrice = render('dashboard', 'token-amount-price');
const AccountBalance = render('dashboard', 'account-balance');
const TokenPrice = render('dashboard', 'token-price');
const PortfolioNft = render('dashboard', 'portfolio-nft');
const PortfolioCharts = render('dashboard', 'portfolio-charts');
const PortfolioTotalPrice = render('dashboard', 'portfolio-total-price');

const tokensDecimalsPow = (amount, decimals, toFixed = 4) =>
  (amount * Math.pow(10, -decimals)).toFixed(toFixed);

add(({ entityId }) => {
  const [tokens, isTokensLoading] = useNearTokens(entityId);
  if (isTokensLoading && !tokens) return 'Loading your portfolio...';

  return (
    <div style={{ marginTop: 10 }}>
      <DashboardSection title="Portfolio price">
        <PortfolioTotalPrice entityId={entityId} />
      </DashboardSection>
      <DashboardSection title="Token balances">
        <div class="bu-columns" style={{ flexFlow: 'wrap' }}>
          <div className="bu-column bu-is-3">
            <AccountBalance entityId={entityId} />
          </div>
          {tokens &&
            tokens.map((tokenCollection) =>
              tokenCollection.tokens !== '0' ? (
                <div class="bu-column bu-is-3">
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
      <PortfolioCharts entityId={entityId} />
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
