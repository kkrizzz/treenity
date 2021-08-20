const AccountName = render('', 'name', 'react-text', { fallback: ({ id }) => id });
const TwoColumn = render('dev', 'two-column');

// TODO
add(({ instruction, transaction }) => {
  console.log('evm inst', instruction, transaction.meta);
  const parsed = instruction.parsed;

  if (!parsed) {
    return (
      <div>
        <b>Uparsed EVM transaction</b>
        {instruction.accounts.map((pubKey, i) => (
          <TwoColumn
            first={`Account #${i}`}
            second={<AccountName id={pubKey} />}
            link={`/address/${pubKey}`}
          />
        ))}
      </div>
    );
  }

  const evmTransaction = parsed.info.transaction;
  return (
    <div>
      <div>Type: {parsed.type}</div>
      <div>Hash: {evmTransaction.hash}</div>
      <div>From: {evmTransaction.from}</div>
      <div>To: {evmTransaction.to}</div>
      <div>Gas used: {evmTransaction.gas}</div>
    </div>
  );
});
