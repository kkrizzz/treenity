function shortenSignature(sign, max) {

}

add(({ transaction, entityId }) => {
  let loading = false;
  if (!transaction) {
    [transaction, loading] = useTransaction(entityId);
  }

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
      Sign: {transaction.transaction.signatures[0]}
      Result: {transaction.meta.err ? 'error' : 'success'}
    </div>
  );
});
