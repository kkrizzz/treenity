exports.useTokenInfo = (token) => {
  const { data, isLoading } = solarea.useQuery([token, 'velas-token-data'], () =>
    fetch(`/api/velas/token/${token}`).then((res) => res.json()),
  );

  return [data, isLoading];
};

exports.useLatestTokenTrades = (token) => {
  const { data, isLoading } = solarea.useQuery(
    ['market_trades', token],
    () => fetch(`/api/velas/market/${token}/trades`).then((res) => res.json()),
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
