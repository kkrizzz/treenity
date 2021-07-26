add(function Link({ to, children, className = '' }) {
  const go = (env) => {
    env.preventDefault();
    window.history.pushState({}, '', to);
  };

  return (
    <a onClick={go} href={to} className={className}>
      {children}
    </a>
  );
});
