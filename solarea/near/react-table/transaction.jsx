const InstructionBadge = render(null, 'instruction', 'react-text');
const Hash = render('dev', 'hash');
const TimeAgo = render('dev', 'time-ago');
const Action = render('near_action', '', 'react-table');
const Icon = render('near_action', 'icon');

const MethodBadge = ({ method }) => {
  return <div class="bu-tag bu-is-light">{method}</div>;
};

const types = {};

add(({ tx }) => {
  const timestamp = new Date(tx.block_timestamp / 1000000);
  const actionKind = tx.action_kind;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <div className="" style={{ overflow: 'auto', display: 'flex', flexFlow: 'nowrap' }}>
          <div
            className="m-r-4"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
          >
            <Icon i={actionKind} />
          </div>
          <Action name={actionKind} tx={tx} action={{ action_kind: actionKind, args: tx.args }} />
        </div>
        <div class="bu-is-size-7 bu-has-text-grey-light bu-mb-2 bu-has-text-weight-bold">
          by {tx.signer_account_id}
        </div>
      </div>
      <div style={{ maxWidth: '20%' }}>
        <div>
          <Hash hash={tx.transaction_hash} type="transaction" />
        </div>
        <div style={{ textAlign: 'right' }}>
          <TimeAgo date={timestamp} />
        </div>
      </div>
    </div>
  );
});
