function shortString(str) {
  if (str.length > 60) {
    return str.substr(0, 30) + '...' + str.substr(str.length - 30, str.length);
  }
  return str;
}

add(({ transaction, entityId }) => {
  let loading = false;
  if (!transaction) {
    [transaction, loading] = useTransaction(entityId);
  }
  return (
    <Render
      id="dev"
      name="two-column"
      is={10}
      link={'/'}
      first={transaction.transaction.signatures[0]}
      second={<Render id="dev" name={'success-badge'} success={!transaction.meta.err}></Render>}
    ></Render>
  );
});
