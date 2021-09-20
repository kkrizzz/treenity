const Switch = render('dev', 'switch');

add(() => {
  const [isExpertMode, setIsExpertMode] = solarea.useLocalStorageState('near_expert_mode', false);
  const [isDarkTheme, setIsDarkTheme] = solarea.useLocalStorageState('dark_theme', false);

  return (
    <nav className="bu-navbar p-t-8 p-b-8" role="navigation" aria-label="main navigation">
      <div className="bu-navbar-end">
        <Switch className="bu-navbar-item" value={isDarkTheme} onChange={setIsDarkTheme}>
          {isDarkTheme ? '🌙' : '☀'}️
        </Switch>
      </div>
    </nav>
  );
});
