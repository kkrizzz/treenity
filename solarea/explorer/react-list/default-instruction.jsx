const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');

add(({ instruction }) => {
  const programPubkey = instruction.programId.toString();

  if (instruction.parsed) {
    return <pre>{JSON.stringify(instruction.parsed.info, null, 2)}</pre>;
  }

  return (
    <div>
      <TwoColumn first="Program" second={<Hash hash={programPubkey} type="address" alignRight />} />
      {instruction.accounts.map((accountPubkey, index) => {
        return (
          <TwoColumn
            first={`Account #${index + 1}`}
            second={<NamedHash hash={accountPubkey} type="address" alignRight />}
          />
        );
      })}
      <div className="bu-columns bu-is-mobile" style={{ justifyContent: 'space-between' }}>
        <div className={`bu-column bu-is-4 text-overflow`}>Data</div>
        <pre
          className="bu-column bu-tc-monospace"
          style={{
            overflowWrap: 'anywhere',
            background: '#232323',
            maxWidth: 440,
          }}
        >
          {instruction.parsed
            ? JSON.stringify(instruction.parsed, null, 2)
            : instruction.data.toString('hex')}
        </pre>
      </div>
    </div>
  );
});
