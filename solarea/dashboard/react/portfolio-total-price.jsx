const DashboardCard = render('dev', 'dashboard-card');
const { useNearPortfolioBalance } = await require('solarea://near/utils');

add(({ entityId }) => {
  const [data, isLoading] = useNearPortfolioBalance(entityId);
  return data ? (
    <DashboardCard>
      {data &&
        (data.TOKENS.reduce((acc, val) => val.priceInUsd + acc, 0) + data.walletBalance).toFixed(
          4,
        ) + '$'}
    </DashboardCard>
  ) : null;
});
