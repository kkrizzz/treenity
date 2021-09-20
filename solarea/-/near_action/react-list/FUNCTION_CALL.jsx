const Hash = render('dev', 'hash');
const DashboardCard = render('dev', 'dashboard-card');
const SingleColumn = render('dev', 'single-column');

add(({ tx, action }) => {
  const receiverAccountId = tx.receiver_account_id;
  const fallback = () => (
    <>
      <SingleColumn>
        <DashboardCard title="Action kind" value={action.action_kind} />
      </SingleColumn>
      <SingleColumn>
        <DashboardCard title="From" value={<Hash hash={tx.signer_account_id} type="account" />} />
      </SingleColumn>
      <SingleColumn>
        <DashboardCard title="To" value={<Hash hash={receiverAccountId} type="account" />} />
      </SingleColumn>
      <DashboardCard title="Args">
        <pre style={{ textAlign: 'left' }} className="bu-box">
          {JSON.stringify(action.args, null, 2)}
        </pre>
      </DashboardCard>
    </>
  );

  return (
    <Render
      tx={tx}
      action={action}
      id={receiverAccountId}
      name={action.args.method_name}
      fallback={fallback}
    />
  );
});
