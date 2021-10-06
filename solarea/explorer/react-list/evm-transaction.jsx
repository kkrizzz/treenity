const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');
const DashboardSection = render('dev', 'dashboard-section');
const { weiToEth, lpsRound } = await require('solarea://explorer/utils');

add(({ tx }) => {
  const gasUsed = parseInt(tx.gas, 16);
  const gasPrice = parseInt(tx.gasPrice, 16);
  const fee = weiToEth(gasUsed * gasPrice, 8);
  console.log('tx', tx);

  return (
    <>
      <div className="bu-columns bu-is-mobile">
        <div class="bu-column bu-is-5">
          From
          <NamedHash hash={tx.from} type="address" />
        </div>
        <div class="bu-column bu-is-2">
          <div style={{ margin: 'auto', width: '1.5rem', marginTop: 16 }}>
            <Render id="icons" name="fe-arrow-right" />
          </div>
        </div>

        <div className="bu-column bu-is-5">
          To
          <NamedHash hash={tx.to} type="address" />
        </div>
      </div>
      <div className="bu-columns bu-is-mobile">
        <div class="bu-column bu-is-4">Amount</div>
        <div class="bu-column bu-is-4 bu-has-text-centered">{weiToEth(tx.value)}</div>

        <div className="bu-column bu-is-4 bu-has-text-right">Fee: {fee}</div>
      </div>
      <div>
        <TwoColumn first="Hash" second={<Hash hash={tx.hash} type="tx" />} />
        <TwoColumn
          first="Block"
          second={<Hash hash={parseInt(tx.blockNumber, 16)} type="block" urlParams="chain=evm" />}
        />
        <TwoColumn first="Gas used" second={gasUsed} />
        <TwoColumn first="Gas price" second={gasPrice} />
        {tx.input && (
          <TwoColumn
            first="Input"
            second={
              <pre
                className="bu-notification bu-monospace log-messages"
                style={{
                  background: 'var(--theme-logs-bg)',
                  color: 'var(--theme-logs-color)',
                  borderRadius: 'var(--theme-border-radus)',
                }}
              >
                {tx.input}
              </pre>
            }
          />
        )}
      </div>
    </>
  );
});
