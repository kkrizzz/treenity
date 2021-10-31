const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');
const DashboardCard = render('dev', 'dashboard-card');
const { weiToEth, lpsRound } = await require('solarea://explorer/utils');

add(({ tx }) => {
  const gasUsed = parseInt(tx.gas, 16);
  const gasPrice = parseInt(tx.gasPrice, 16);
  const fee = weiToEth(gasUsed * gasPrice, 8);

  return (
    <>
      <Render
        id={tx.to}
        name="evm-call"
        render={(item) => (
          <DashboardCard subcard size="small" title="Contract call">
            {item}
          </DashboardCard>
        )}
        tx={tx}
        fallback={() => {}}
      />
      <div className="bu-columns">
        <div className="bu-column bu-is-4">
          <DashboardCard subcard size="small" title="From">
            <NamedHash hash={tx.from} type="address" />
          </DashboardCard>
        </div>
        <div className="bu-column bu-is-4">
          <DashboardCard subcard size="small" title="Amount" value={weiToEth(tx.value)} />
        </div>
        <div className="bu-column bu-is-4">
          <DashboardCard subcard size="small" title="To">
            <NamedHash hash={tx.to} type="address" />
          </DashboardCard>
        </div>
      </div>
      <div className="bu-columns">
        <div className="bu-column bu-is-6">
          <DashboardCard subcard size="small" title={'Hash'}>
            <Hash hash={tx.hash} type="tx" />
          </DashboardCard>
        </div>
        <div className="bu-column bu-is-6">
          <DashboardCard subcard size="small" title="Block">
            <Hash hash={parseInt(tx.blockNumber, 16)} type="block" urlParams="chain=evm" />
          </DashboardCard>
        </div>
      </div>
      <div className="bu-columns">
        <div className="bu-column bu-is-4">
          <DashboardCard subcard size="small" title="Fee" value={fee} />
        </div>
        <div className="bu-column bu-is-4">
          <DashboardCard subcard size="small" title="Gas used" value={gasUsed} />
        </div>
        <div className="bu-column bu-is-4">
          <DashboardCard subcard size="small" title="Gas price" value={gasPrice} />
        </div>
      </div>
      {tx.input && (
        <div className="bu-columns">
          <div className="bu-column bu-is-12">
            <pre
              className="bu-notification bu-monospace log-messages"
              style={{
                background: 'var(--theme-logs-bg)',
                color: 'var(--theme-logs-color)',
                borderRadius: 'var(--theme-border-radus)',
                wordWrap: 'break-word',
                whiteSpace: 'normal',
              }}
            >
              {tx.input}
            </pre>
          </div>
        </div>
      )}
    </>
  );
});
