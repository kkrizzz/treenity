const Chart = render('dev', 'chart');

add(({ contract }) => {
  const { data: tokenData, isLoading: isTokenDataLoading } = solarea.useQuery(
    [contract, 'token_chart_price'],
    () => fetch(`/near/price/${contract}`).then((res) => res.json()),
  );

  if (!tokenData && isTokenDataLoading) return;

  return (
    <Chart
      max={10}
      labels={tokenData.prices
        .slice(0, 200)
        .map((i) =>
          new Date(i.timestamp).toLocaleDateString('en', { month: 'short', day: '2-digit' }),
        )}
      data={tokenData.prices.slice(0, 200).map((i) => i.price.toFixed(2))}
    />
  );
});
