add(function Link({ to, onClick, children, className = '', style }) {
  const go = (env) => {
    env.preventDefault();
    window.history.pushState({}, '', to);
    onClick && onClick();
  };

  return (
    <a onClick={go} href={to} className={className} style={style}>
      {children}
    </a>
  );
});
