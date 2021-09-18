const { useNearCoinData } = await require('solarea://near/utils');
const useQuery = solarea.useQuery;

add(({ contract }) => {
  const [nearTokenData, isNearTokenDataLoading] = useNearCoinData();
  const { data: tokenData, isLoading: isTokenDataLoading } = useQuery(
    [contract, 'token_price'],
    () => fetch(`/near/price/${contract}`).then((res) => res.json()),
  );
  if (isTokenDataLoading || isNearTokenDataLoading) return 'Loading ...';
  // console.log(nearTokenData, tokenData);
  const nearPerToken = tokenData.price.price;
  const nearPrice = nearTokenData.market_data.current_price.usd;

  const tokenPrice = nearPerToken * nearPrice;
  return (
    <div
      class="asset-wrapper"
      style={{
        background: 'white',
        boxShadow: '0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0px 0 1px rgb(10 10 10 / 2%)',
      }}
    >
      <div class="asset-icon">
        <figure class="bu-image bu-is-32x32">
          <img src={tokenData.info.icon} />
        </figure>
      </div>
      <div class="asset-info">
        <div>{tokenData.info.symbol}</div>
        <div>${tokenPrice.toFixed(4)}</div>
      </div>
    </div>
  );
});
