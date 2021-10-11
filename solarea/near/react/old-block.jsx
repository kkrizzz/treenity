const nearUtils = await require('solarea://near/utils');
const DashboardCard = render('dev', 'dashboard-card');
const DashboardSection = render('dev', 'dashboard-section');
const Action = render('near_action', '', 'react-table');
const ActionOverview = render('near_action', '', 'react-list');
const Hash = render('dev', 'hash');
const SingleColumn = render('dev', 'single-column');
const TransactionRow = render('near', 'transaction', 'react-table');

add(({ entityId }) => {
  const [blockFromIndexer, isBlockFromIndexerLoading] = nearUtils.useNearBlockFromIndexer(entityId);
  // const [blockFromRPC, isBlockFromRPCLoading] = nearUtils.useNearBlockFromRPC(entityId);
  if (isBlockFromIndexerLoading) return 'Loading ...';
  console.log(blockFromIndexer);
  return (
    <div>
      <DashboardSection title="Block">
        <div class="bu-columns">
          <div class="bu-column">
            <DashboardCard title="Height">
              <Hash hash={blockFromIndexer.block_height} type="block"></Hash>
            </DashboardCard>
          </div>
          <div class="bu-column">
            <DashboardCard title="Status">Finalized</DashboardCard>
          </div>
          <div class="bu-column">
            <DashboardCard title="Timestamp">
              {new Date(blockFromIndexer.block_timestamp / 1000000).toLocaleString()}
            </DashboardCard>
          </div>
        </div>
        <SingleColumn>
          <DashboardCard title="Validator">
            <Hash hash={blockFromIndexer.author_account_id} type="account" />
          </DashboardCard>
        </SingleColumn>
        <SingleColumn>
          <DashboardCard title="Gas used">
            {(
              blockFromIndexer.transactions.reduce(
                (acc, val) => (acc += Number(val.receipt_conversion_gas_burnt)),
                0,
              ) * 0.000000000001
            ).toFixed(0)}{' '}
            Tgas
          </DashboardCard>
        </SingleColumn>
      </DashboardSection>
      <DashboardSection title="Transactions">
        {blockFromIndexer.transactions.map((i) => (
          <div key={`${i.transaction_hash}`} class="bu-box theme-inner-instruction inner-shadow">
            <TransactionRow tx={i} />
          </div>
        ))}
      </DashboardSection>
    </div>
  );
});
