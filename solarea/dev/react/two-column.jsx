add(({ first, second, is = 4, link: lk }) => {
  useCSS(
    'two-column.css',
    `
  `,
  );
  return (
    <div class="bu-columns bu-is-mobile">
      <div class={`bu-column bu-is-${is} text-overflow`}>{first}</div>
      <div className="bu-column bu-has-text-right overflow-hidden">
        {lk ? (
          <Render id="dev" name="link" className="bu-tc-link" to={lk}>
            {second}
          </Render>
        ) : (
          <div>{second}</div>
        )}
      </div>
    </div>
  );
});
