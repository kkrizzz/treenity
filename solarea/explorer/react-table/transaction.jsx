const InstructionBadge = render(null, 'instruction', 'react-text');
const Hash = render('dev', 'hash');

function shortString(str, max) {
  if (str.length > max) {
    const half = max / 2 - 1;
    return str.substr(0, half) + '...' + str.substr(str.length - half, str.length);
  }
  return str;
}

add(({ transaction, signature }) => {
  let loading = false;
  if (!transaction) {
    [transaction, loading] = solarea.useTransaction(signature, true);
  }

  if (loading || !transaction) return 'loading...';

  signature = signature || transaction.transaction.signatures[0];

  const hasTime = !!transaction.blockTime;
  const txDate = new Date(transaction.blockTime * 1000);

  return (
    <div class="bu-columns bu-is-mobile">
      <div class="bu-column bu-is-4 text-overflow bu-is-code">
        <Hash hash={signature} type="tx" />
      </div>
      <div
        style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}
        className={`bu-column ${hasTime ? 'bu-is-4' : 'bu-is-6'} bu-is-mobile`}
      >
        {transaction.transaction.message.instructions.map((i) => (
          <InstructionBadge
            id={i.programId}
            instruction={i}
            render={(elem) => <div className="bu-tag bu-is-black">{elem}</div>}
            fallback={() => <div class="bu-tag bu-is-light bu-is-danger">unknown</div>}
          />
        ))}
      </div>
      {hasTime && (
        <div className="bu-column bu-is-2 bu-is-mobile">
          <Render id="dev" name="time-ago" date={txDate} />
        </div>
      )}
      <div className="bu-column bu-is-2 bu-is-mobile">
        <Render id="dev" name="success-badge" success={!transaction.meta?.err} />
      </div>
    </div>
  );
});
