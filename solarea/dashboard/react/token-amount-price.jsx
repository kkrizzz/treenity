const { useNearCoinData } = await require('solarea://near/utils');
const useQuery = solarea.useQuery;

add(({ contract, amount }) => {
  const [nearTokenData, isNearTokenDataLoading] = useNearCoinData();
  const { data: tokenData, isLoading: isTokenDataLoading } = useQuery(
    [contract, 'token_price'],
    () => fetch(`/near/price/${contract}`).then((res) => res.json()),
  );
  if (isTokenDataLoading || isNearTokenDataLoading) return 'Loading ...';
  console.log(nearTokenData, tokenData);
  const nearPerToken = tokenData.price.price;
  const nearPrice = nearTokenData.market_data.current_price.usd;

  const tokenPrice = nearPerToken * nearPrice;
  return (
    <div class="asset-wrapper">
      <div class="asset-icon">
        <figure class="bu-image bu-is-32x32">
          <img src={tokenData.info.icon} />
        </figure>
      </div>
      <div class="asset-info">
        <div>
          {amount} {tokenData.info.symbol}
        </div>
        <div className="asset-info-symbol">${(tokenPrice * amount).toFixed(4)}</div>
      </div>
    </div>
  );
});
