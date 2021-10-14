const nearUtils = await require('solarea://near/utils');

add(({ contract, amount }) => {
  const [tokenPrice, isTokenPriceLoading] = nearUtils.useNearTokenPrice(contract);
  if (isTokenPriceLoading) return 'Loading ...';
  return `$${(amount * tokenPrice.price.usd).toFixed(4)}`;
});
