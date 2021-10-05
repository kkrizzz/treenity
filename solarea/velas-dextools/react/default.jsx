const { useBitQueryTokenInfo } = await require('solarea://velas-dextools/utils');
const DashboardCard = render('dev', 'dashboard-card');

add(() => {
  return <DashboardCard title="Velas dextools">Search for token</DashboardCard>;
});
