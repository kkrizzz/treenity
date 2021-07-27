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
    [transaction, loading] = solarea.useTransaction(entityId);
  }

  const instructions = transaction.transaction.instructions.map((i) => (
    <Render
      id={i.programId.toBase58()}
      context="react-text"
      name="instruction"
      instruction={i}
      render={(elem) => <div className="bu-tag bu-is-black">{elem}</div>}
      fallback={<div class="bu-tag bu-is-light bu-is-danger">unknown</div>}
    />
  ));

  const signature = solarea.bs58.encode(transaction.transaction.signatures[0].signature);
  return (
    <div class="bu-columns bu-is-mobile">
      <div class="bu-column bu-is-4 text-overflow bu-is-code">
        <span style={{ fontFamily: 'monospace' }}>
          <Render id="dev" name="link" className="link" to={`/tx/${signature}`}>
            {shortString(signature, 20)}
          </Render>
        </span>
      </div>
      <div class="bu-column bu-is-6 bu-is-mobile" style={{ display: 'flex', gap: 4 }}>
        {instructions}
      </div>
      <div class="bu-column bu-is-mobile">
        <Render id="dev" name="success-badge" success={!transaction.meta.err} />
      </div>
    </div>
  );
});
