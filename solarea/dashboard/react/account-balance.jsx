const {
  useAccount: useNearAccount,
  nearHumanBalance,
  useNearCoinData,
} = await require('solarea://near/utils');
const Icon = render('dashboard', 'icon');

const nearIcon =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyODggMjg4Ij48ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIj48cGF0aCBkPSJNMTg3LjU4LDc5LjgxbC0zMC4xLDQ0LjY5YTMuMiwzLjIsMCwwLDAsNC43NSw0LjJMMTkxLjg2LDEwM2ExLjIsMS4yLDAsMCwxLDIsLjkxdjgwLjQ2YTEuMiwxLjIsMCwwLDEtMi4xMi43N0wxMDIuMTgsNzcuOTNBMTUuMzUsMTUuMzUsMCwwLDAsOTAuNDcsNzIuNUg4Ny4zNEExNS4zNCwxNS4zNCwwLDAsMCw3Miw4Ny44NFYyMDEuMTZBMTUuMzQsMTUuMzQsMCwwLDAsODcuMzQsMjE2LjVoMGExNS4zNSwxNS4zNSwwLDAsMCwxMy4wOC03LjMxbDMwLjEtNDQuNjlhMy4yLDMuMiwwLDAsMC00Ljc1LTQuMkw5Ni4xNCwxODZhMS4yLDEuMiwwLDAsMS0yLS45MVYxMDQuNjFhMS4yLDEuMiwwLDAsMSwyLjEyLS43N2w4OS41NSwxMDcuMjNhMTUuMzUsMTUuMzUsMCwwLDAsMTEuNzEsNS40M2gzLjEzQTE1LjM0LDE1LjM0LDAsMCwwLDIxNiwyMDEuMTZWODcuODRBMTUuMzQsMTUuMzQsMCwwLDAsMjAwLjY2LDcyLjVoMEExNS4zNSwxNS4zNSwwLDAsMCwxODcuNTgsNzkuODFaIi8+PC9nPjwvc3ZnPg==';

add(({ entityId }) => {
  const [accData, isLoading] = useNearAccount(entityId);
  const [nearTokenData, isNearTokenDataLoading] = useNearCoinData();
  if (isLoading || isNearTokenDataLoading) return 'Loading ...';

  const nearPrice = nearTokenData.market_data.current_price.usd;

  const amount = accData.amount * 0.000000000000000000000001;
  return (
    <div class="asset-wrapper">
      <div class="asset-icon">
        <figure class="bu-image bu-is-32x32">
          <img src={nearIcon} />
        </figure>
      </div>
      <div class="asset-info">
        <div>{amount.toFixed(4)} NEAR</div>
        <div className="asset-info-symbol">${(nearPrice * amount).toFixed(4)}</div>
      </div>
    </div>
  );
});
