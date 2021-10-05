const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');
const { weiToEth, lpsRound } = await require('solarea://explorer/utils');

// TODO
add(({ instruction, transaction }) => {
  console.log('evm inst', instruction, transaction.meta);
  if (!instruction.parsed) {
    return (
      <div>
        {instruction.accounts.map((pubKey, i) => (
          <TwoColumn first={`Account #${i}`} second={<Hash hash={pubKey} type="address" />} />
        ))}
      </div>
    );
  }
  if (instruction.parsed.type === 'evmTransaction') {
    const evmTransaction = instruction.parsed.info.transaction;

    return <Render tx={evmTransaction} id="explorer" name="evm-transaction" context="react-list" />;
  } else if (instruction.parsed.type === 'swapNativeToEvm') {
    const info = instruction.parsed.info;
    const from = info.fromNativeAccount;
    const to = info.toEvmAccount;
    const amount = lpsRound(info.lamports);

    return (
      <>
        <div className="bu-columns">
          <div class="bu-column bu-is-5">
            From
            <NamedHash hash={from} type="address" />
          </div>
          <div class="bu-column bu-is-2">
            <div style={{ margin: 'auto', width: '1.5rem', marginTop: 16 }}>
              <Render id="icons" name="fe-arrow-right" />
            </div>
          </div>

          <div className="bu-column bu-is-5">
            To
            <Hash hash={to} type="address" />
          </div>
        </div>
        <div className="bu-columns">
          <div class="bu-column bu-is-4">Amount</div>
          <div class="bu-column bu-is-4 bu-has-text-centered">{amount}</div>
        </div>
        <div>
          <TwoColumn first="Type" second={instruction.parsed.type} />
        </div>
      </>
    );
  } else {
    return (
      <Render
        id="explorer"
        name="default-instruction"
        context="react-list"
        instruction={instruction}
      />
    );
  }
});
