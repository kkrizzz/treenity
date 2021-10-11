const { numberWithSpaces } = await require('solarea://explorer/utils');

add(({ first, second, is = 4, link: lk, isMobile = true, isTextRight = true }) => {
  const parsedSecond = numberWithSpaces(second);

  return (
    <div class={`bu-columns ${isMobile ? 'bu-is-mobile' : ''}`}>
      <div class={`bu-column bu-is-${is} text-overflow`}>{first}</div>
      <div className={`bu-column ${isTextRight ? 'bu-has-text-right' : ''} overflow-hidden`}>
        {lk ? (
          <Render id="dev" name="link" className="bu-tc-link" to={lk}>
            {second}
          </Render>
        ) : (
          <div>{parsedSecond}</div>
        )}
      </div>
    </div>
  );
});
