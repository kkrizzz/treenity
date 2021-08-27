const { numberWithSpaces } = await require('solarea://explorer/utils');

add(({ first, second, is = 4, link: lk }) => {
  useCSS(
    'two-column.css',
    `
  `,
  );

  const parsedSecond = React.useCallback(() => {
    switch (typeof second) {
      case 'number':
        return second.toString().includes('0x') ? second : numberWithSpaces(second);
      case 'string':
        return second.includes('0x') ? second : numberWithSpaces(second);
      default:
        return second;
    }
  }, []);

  return (
    <div class="bu-columns bu-is-mobile">
      <div class={`bu-column bu-is-${is} text-overflow`}>{first}</div>
      <div className="bu-column bu-has-text-right overflow-hidden">
        {lk ? (
          <Render id="dev" name="link" className="bu-tc-link" to={lk}>
            {second}
          </Render>
        ) : (
          <div>{parsedSecond()}</div>
        )}
      </div>
    </div>
  );
});
