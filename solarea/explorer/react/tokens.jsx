const BulmaCard = render('dev', 'bulma-card');

add(() => {
  return (
    <Render id="explorer" name="layout">
      <div className="bu-container bu-is-max-desktop">
        <BulmaCard header="Tokens"></BulmaCard>
      </div>
    </Render>
  );
});
