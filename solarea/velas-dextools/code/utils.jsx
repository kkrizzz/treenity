exports.useTokenInfo = (token) => {
  const { data, isLoading } = solarea.useQuery([token, 'velas-token-data'], () =>
    fetch(`/velas/token/${token}`).then((res) => res.json()),
  );

  return [data, isLoading];
};

exports.useLatestTokenTrades = (token) => {
  const { data, isLoading } = solarea.useQuery(['market_trades', token], () =>
    fetch(`/velas/market/${token}/trades`).then((res) => res.json()),
  );

  return [data, isLoading];
};
