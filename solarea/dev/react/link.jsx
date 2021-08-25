add(function Link({ to, children, className = '', style }) {
  const go = (env) => {
    env.preventDefault();
    window.history.pushState({}, '', to);
  };

  return (
    <a onClick={go} href={to} className={className} style={style}>
      {children}
    </a>
  );
});
