const nearUtils = await require('solarea://near/utils');

add(({ contract, amount }) => {
  const [tokenPrice, isTokenPriceLoading] = nearUtils.useNearTokenPrice(contract);
  if (isTokenPriceLoading) return 'Loading ...';
  if (!tokenPrice) return '$?';
  return `$${(amount * tokenPrice.price.usd).toFixed(4)}`;
});
