const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');
const DashboardCard = render('dev', 'dashboard-card');
const TimeAgo = render('dev', 'time-ago');

const { weiToEth, lpsRound } = await require('solarea://explorer/utils');

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

add(({ tx }) => {
  const [block, isBlockLoading] = solarea.useSolanaRpc('eth_getBlockByNumber', [
    tx.blockNumber,
    false,
  ]);

  const gasUsed = parseInt(tx.gas, 16);
  const gasPrice = parseInt(tx.gasPrice, 16);
  const fee = weiToEth(gasUsed * gasPrice, 8);

  const blockNumber = parseInt(tx.blockNumber, 16);
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
          <DashboardCard subcard size="small" title="Hash">
            <Hash hash={tx.hash} type="tx" />
          </DashboardCard>
        </div>
        <div className="bu-column bu-is-6">
          <DashboardCard subcard size="small" title="Block">
            <Row>
              <Hash hash={blockNumber} type="block" urlParams="chain=evm" />
              <div className="bu-ml-4">
                {block && <TimeAgo date={new Date(parseInt(block.timestamp, 16) * 1000)} />}
              </div>
            </Row>
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
