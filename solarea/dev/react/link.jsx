add(function Link({ to, onClick, children, className = '', style }) {
  const external = to.startsWith('http') || to.startsWith('//');
  const go = external
    ? undefined
    : (evt) => {
        evt.preventDefault();
        window.history.pushState({}, '', to);
        onClick && onClick();
      };

  return (
    <a onClick={go} href={to} className={className} style={style}>
      {children}
    </a>
  );
});
