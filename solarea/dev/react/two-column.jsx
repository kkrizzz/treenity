add(({ first, second, is = 4, link: lk }) => {
  useCSS(
    'two-column.css',
    `
   .link {
     font-family: monospace;
     color: #0790d4;
     cursor: pointer;
   }
   .link:hover {
     color: #006ba0;
   }
  `,
  );
  const handleClick = () => {
    window.history.pushState({}, {}, `/${lk}`);
  };
  return (
    <div class="columns is-mobile">
      <div
        onClick={lk ? handleClick : () => {}}
        class={`column is-${is} text-overflow ${lk ? 'link' : ''}`}
      >
        {first}
      </div>
      <div class="column is-mobile">{second}</div>
    </div>
  );
});
