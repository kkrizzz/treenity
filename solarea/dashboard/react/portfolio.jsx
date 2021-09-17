const {
  useAccount: useNearAccount,
  nearHumanBalance,
  useNearNFT,
  useNearAccTransactions,
  useNearTokens,
} = await require('solarea://near/utils');

const TokenAmountPrice = render('dashboard', 'token-amount-price');

const tokensDecimalsPow = (amount, decimals, toFixed = 4) =>
  (amount * Math.pow(10, -decimals)).toFixed(toFixed);

add(({ entityId }) => {
  const [tokens, isTokensLoading] = useNearTokens(entityId);
  if (isTokensLoading && !tokens) return 'Loading your portfolio...';

  return (
    <div>
      {tokens &&
        tokens.map((tokenCollection) =>
          tokenCollection.tokens !== '0' ? (
            <TokenAmountPrice
              contract={tokenCollection.contract}
              amount={tokensDecimalsPow(tokenCollection.tokens, tokenCollection.metadata.decimals)}
            />
          ) : null,
        )}
    </div>
  );
});
