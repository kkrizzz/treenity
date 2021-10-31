const StyledLink = styled.a`
  color: var(--theme-a-color);

  &:hover {
    color: var(--theme-a-hover-color);
  }
`;

add(function Link({ to, onClick, children, className = '', style, target }) {
  const external = to.startsWith('http') || to.startsWith('//');
  const go = external
    ? undefined
    : (evt) => {
        evt.preventDefault();
        window.history.pushState({}, '', to);
        onClick && onClick();
      };

  return (
    <StyledLink onClick={go} href={to} className={className} style={style} target={target}>
      {children}
    </StyledLink>
  );
});
