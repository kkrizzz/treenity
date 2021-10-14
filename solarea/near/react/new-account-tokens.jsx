const nearUtils = await require('solarea://near/utils');
const TwoColumn = render('dev', 'two-column');
const Link = render('dev', 'link');
const TokenAmountPrice = render('near', 'token-amount-price', 'react-list');
const DashboardCard = render('dev', 'dashboard-card');

const tokensDecimalsPow = (amount, decimals, toFixed = 4) =>
  (amount * Math.pow(10, -decimals)).toFixed(toFixed);

const Divider = render('near', 'divider');

const RenderTokens = ({ entityId }) => {
  const [tokenData, isTokenDataLoading] = nearUtils.useNearTokens(entityId);
  if (isTokenDataLoading) return 'Loading tokens ...';
  return tokenData ? (
    tokenData.map((tokenCollection) =>
      tokenCollection.tokens !== '0' ? (
        <>
          <div class="bu-columns bu-is-mobile">
            <div class="bu-column bu-is-6 bu-is-flex bu-is-align-items-center">
              <img style={{ marginRight: 8 }} width={16} src={tokenCollection.metadata.icon} />
              <Link to={`/account/${tokenCollection.contract}`}>
                {tokenCollection.metadata.name}
              </Link>
            </div>
            <div class="bu-column bu-is-4 bu-has-text-right">
              {tokensDecimalsPow(tokenCollection.tokens, tokenCollection.metadata.decimals)}
            </div>
            <div class="bu-has-text-grey-dark bu-has-text-weight-bold bu-column bu-is-2 bu-has-text-right">
              <TokenAmountPrice
                contract={tokenCollection.contract}
                amount={tokensDecimalsPow(
                  tokenCollection.tokens,
                  tokenCollection.metadata.decimals,
                )}
              />
            </div>
          </div>
          <Divider />
        </>
      ) : null,
    )
  ) : (
    <div>No tokens</div>
  );
};

add(RenderTokens);
