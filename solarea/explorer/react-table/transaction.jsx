const InstructionBadge = render(null, 'instruction', 'react-text');
const Hash = render('dev', 'hash');
const DashboardCard = render('dev', 'dashboard-card');

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
    <DashboardCard title={<Hash hash={signature} type="tx" />}>
      <div
        className="bu-media  bu-is-align-items-center"
        style={{
          fontSize: 12,
          color: 'var(--theme-main-content-color)',
          paddingTop: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
          {transaction.transaction.message.instructions.map((i) => (
            <InstructionBadge
              id={i.programId}
              instruction={i}
              render={(elem) => (
                <div
                  className="bu-tag"
                  style={{
                    border: '1px solid var(--theme-a-color)',
                    color: 'var(--theme-a-color)',
                    background: 'transparent',
                  }}
                >
                  {elem}
                </div>
              )}
              fallback={() => (
                <div
                  className="bu-tag"
                  style={{
                    border: '1px solid var(--theme-main-content-color)',
                    color: 'var(--theme-main-content-color)',
                    background: 'transparent',
                  }}
                >
                  unknown
                </div>
              )}
            />
          ))}
        </div>

        <div style={{ marginLeft: 'auto', width: 'max-content' }}>
          <span style={{ marginRight: 8 }}>
            {hasTime && <Render id="dev" name="time-ago" date={txDate} />}
          </span>

          <Render id="dev" name="success-badge" success={!transaction.meta?.err} />
        </div>
      </div>
    </DashboardCard>
  );
});
