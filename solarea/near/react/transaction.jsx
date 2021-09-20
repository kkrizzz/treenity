const { useNearTx, nearHumanBalance } = await require('solarea://near/utils');
const BulmaCard = render('dev', 'bulma-card');
const TwoColumn = render('dev', 'two-column');
const Tabs = render('dev', 'tabs');
const Link = render('dev', 'link');
const AccountTokens = render('near', 'account-tokens');
const Hash = render('dev', 'hash');
const Table = render('dev', 'table');
const NamedHash = render('dev', 'named-hash');
const TransactionRow = render('near', 'transaction', 'react-table');
const ScrollBox = render('dev', 'scroll-box');
const AccountNfts = render('near', 'account-nfts');
const Dropdown = render('dev', 'dropdown');
const Icon = render('near_action', 'icon');
const DashboardCard = render('dev', 'dashboard-card');
const DashboardSection = render('dev', 'dashboard-section');
const Action = render('near_action', '', 'react-table');
const ActionOverview = render('near_action', '', 'react-list');

add(({ entityId }) => {
  const [tx, isTxLoading] = useNearTx(entityId);

  if (isTxLoading) return 'Loading';
  console.log(tx);
  return (
    <div>
      <DashboardSection title="Transaction">
        <div class="bu-columns">
          <div class="bu-column">
            <DashboardCard title="Block">{tx.block_height}</DashboardCard>
          </div>
          <div class="bu-column">
            <DashboardCard title="Fee">0.00004 Ⓝ</DashboardCard>
          </div>
          <div class="bu-column">
            <DashboardCard title="Timestamp">
              {new Date(tx.block_timestamp / 1000000).toLocaleString()}
            </DashboardCard>
          </div>
        </div>
        <div class="bu-columns">
          <div class="bu-column">
            <DashboardCard title="Hash">
              <Hash hash={tx.transaction_hash} />
            </DashboardCard>
          </div>
        </div>
        <div class="bu-columns">
          <div class="bu-column bu-is-6">
            <DashboardCard title="Signed by">
              <Hash type="account" hash={tx.signer_account_id} />
            </DashboardCard>
          </div>
          <div class="bu-column bu-is-6">
            <DashboardCard title="Receiver">
              <Hash type="account" hash={tx.receiver_account_id} />
            </DashboardCard>
          </div>
        </div>
      </DashboardSection>
      <DashboardSection title="Action overview">
        {tx.actions.map((action) => (
          <ActionOverview
            name={action.action_kind}
            tx={tx}
            action={action}
            fallback={() => <Action name={action.action_kind} tx={tx} action={action} />}
          />
        ))}
      </DashboardSection>
      <DashboardSection title="Transaction execution">
        <div class="bu-columns">
          <div class="bu-column">
            <DashboardCard title="Gas burned">
              {(tx.receipt_conversion_gas_burnt * 0.000000000001).toFixed(0)} Tgas
            </DashboardCard>
          </div>
          <div class="bu-column">
            <DashboardCard title="Tokens burned">
              {nearHumanBalance(tx.receipt_conversion_tokens_burnt)}
            </DashboardCard>
          </div>
        </div>
      </DashboardSection>
    </div>
  );
});
