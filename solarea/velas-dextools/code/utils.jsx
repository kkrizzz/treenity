exports.useTokenInfo = (token) => {
  const { data, isLoading } = solarea.useQuery([token, 'velas-token-data'], () =>
    fetch(`/velas/token/${token}`).then((res) => res.json()),
  );

  return [data, isLoading];
};
