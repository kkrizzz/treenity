const { useNearTokens } = await require('solarea://near/utils');
const TokenAmountPrice = render('dashboard', 'token-amount-price');
const AccountBalance = render('dashboard', 'account-balance');

const tokensDecimalsPow = (amount, decimals, toFixed = 4) =>
  (amount * Math.pow(10, -decimals)).toFixed(toFixed);

add(({ entityId }) => {
  const [tokens, isTokensLoading] = useNearTokens(entityId);
  if (isTokensLoading && !tokens) return 'Loading your portfolio...';

  return (
    <div className="bu-columns">
      <div className="bu-column">
        <AccountBalance entityId={entityId} />
      </div>
      {tokens &&
        tokens.map((tokenCollection) =>
          tokenCollection.tokens !== '0' ? (
            <div className="bu-column">
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
  );
});
