function shortString(str, max) {
  if (str.length > max) {
    const half = max / 2 - 1;
    return str.substr(0, half) + '...' + str.substr(str.length - half, str.length);
  }
  return str;
}

add(({ transaction, entityId }) => {
  let loading = false;
  if (!transaction) {
    [transaction, loading] = useTransaction(entityId);
  }

  const resolveKey = (id) => transaction.transaction.message.accountKeys[id];

  const instructions = transaction.transaction.message.instructions.map((i) => (
    <Render
      id={resolveKey(i.programIdIndex)}
      context="react-badge"
      name="instruction"
      instruction={i}
      fallback={<div class="tag is-light is-danger">unknown</div>}
    />
  ));

  const signature = transaction.transaction.signatures[0];
  return (
    <div class="columns is-mobile">
      <div class="column is-4 text-overflow is-code">
        <span style={{ fontFamily: 'monospace' }}>
          <Render id="dev" name="link" className="link" to={`/tx/${signature}`}>
            {shortString(signature, 20)}
          </Render>
        </span>
      </div>
      <div class="column is-6 is-mobile tags">{instructions}</div>
      <div class="column is-mobile">
        <Render id="dev" name="success-badge" success={!transaction.meta.err} />
      </div>
    </div>
  );
});
