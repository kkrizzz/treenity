exports.useTokenInfo = (quote, base) => {
  const { data, isLoading } = solarea.useQuery([token, 'velas-token-data'], () =>
    fetch(`/api/velas/token/${token}`).then((res) => res.json()),
  );

  return [data, isLoading];
};

exports.useLatestTokenTrades = (quote, base) => {
  const { data, isLoading } = solarea.useQuery(
    ['market_trades', `${quote}_${base}`],
    () => fetch(`/api/velas/market/${quote}/${base}/trades`).then((res) => res.json()),
    { refetchInterval: 30000 },
  );

  return [data, isLoading];
};

exports.useLatestImportantActions = (limit) => {
  const { data, isLoading } = solarea.useQuery(
    ['latest_actions', limit],
    () => fetch(`/api/velas/importantactions?limit=${limit}`).then((res) => res.json()),
    { refetchInterval: 30000 },
  );

  return [data, isLoading];
};

exports.useHotTokenPairs = () => {
  const { data, isLoading } = solarea.useQuery(['hottest_pair'], () =>
    fetch(`/api/velas/token/hot`).then((res) => res.json()),
  );

  return [data, isLoading];
};

/* {
  type: add remove
  token:
} */
exports.useLiquidityPoolsActivity = (quote, base, limit) => {
  const { data, isLoading } = solarea.useQuery([base, quote, 'liquidity_pools_activity'], () =>
    fetch(`/api/velas/market/${quote}/${base}/liquidity?limit=${limit}`).then((res) => res.json()),
  );

  return [data, isLoading];
};

exports.useTokenInfoFromGraph = (address) => {
  const { data, isLoading } = solarea.useQuery([address, 'token_data_from_the_graph'], () =>
    fetch(`/api/velas/token/${address}/data`).then((res) => res.json()),
  );

  return [data, isLoading];
};
