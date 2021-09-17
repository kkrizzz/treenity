const Icon = render('dashboard', 'icon');

add(function ComponentList({ children, title, onClick }) {
  return (
    <div className="bu-card">
      <header className="bu-card-header">
        <p className="bu-card-header-title">{title}</p>

        {onClick && (
          <button className="bu-card-header-icon" aria-label="more options" onClick={onClick}>
            <Icon type="gear" />
          </button>
        )}
      </header>

      <div className="bu-card-content">
        <div className="bu-content">{children}</div>
      </div>
    </div>
  );
});
