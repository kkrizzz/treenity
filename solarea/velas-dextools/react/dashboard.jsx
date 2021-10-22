await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Dashboard = render('draggable-dashboard');

add(({ dashboardName, id }) => {
  return (
    <div>
      <Dashboard
        availableComponentsIDs={['token-chart']}
        componentsBaseId={id}
        dashboardName={dashboardName}
      />
    </div>
  );
});
