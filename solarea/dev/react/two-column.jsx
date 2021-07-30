add(({ first, second, is = 4, link: lk }) => {
  useCSS(
    'two-column.css',
    `
   .tc-link {
     font-family: monospace;
     color: #0790d4;
     cursor: pointer;
   }
   .tc-link:hover {
     color: #006ba0;
   }
   .tc-monospace {
     font-family: monospace;
   }
  `,
  );
  return (
    <div class="bu-columns bu-is-mobile">
      <div class={`bu-column bu-is-${is} text-overflow`}>{first}</div>
      <div className="bu-column tc-monospace bu-has-text-right">
        {lk ? (
          <Render id="dev" name="link" className="tc-link" to={lk}>
            {second}
          </Render>
        ) : (
          second
        )}
      </div>
    </div>
  );
});
