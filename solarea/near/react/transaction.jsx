const { useNearTx, nearHumanBalance } = await require('solarea://near/utils');
const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');
const Action = render('near_action', '', 'react-table');
const Divider = render('near', 'divider');
const Overview = render('near', 'overview');

const CustomTwoColumn = ({ first, second, link }) => (
  <TwoColumn first={first} second={second} link={link} is={2} isTextRight={false} />
);

const StatusBadge = ({ status }) => {
  const isSuccess = status === 'SUCCESS_RECEIPT_ID';
  return (
    <div class={`bu-tag ${isSuccess ? 'bu-is-success' : 'bu-is-danger'}`}>
      {isSuccess ? 'Success' : 'Error'}
    </div>
  );
};

add(({ entityId }) => {
  const [tx, isTxLoading] = useNearTx(entityId);

  if (isTxLoading) return 'Loading';
  console.log(tx);
  return (
    <div>
      <div className="bu-is-size-4 bu-is-flex bu-is-flex-direction-row bu-is-align-items-center bu-mb-5">
        Transaction details
      </div>
      <Overview>
        <div class="bu-columns">
          <div class="bu-column custom-header bu-mb-3 bu-has-text-grey-darker bu-has-text-weight-bold">
            Overview
          </div>
        </div>
        <TwoColumn isTextRight={false} is={2} first="Hash" second={entityId} />
        <Divider />
        <CustomTwoColumn first="Status" second={<StatusBadge status={tx.status} />} />
        <Divider />
        <CustomTwoColumn
          first="Block"
          link={`/new-block/${tx.block_height}`}
          second={tx.block_height}
        />
        <Divider />
        <CustomTwoColumn
          first="Timestamp"
          second={new Date(tx.block_timestamp / 1000000).toLocaleString()}
        />
        <Divider />
        <CustomTwoColumn
          first="From"
          second={<Hash hash={tx.signer_account_id} type="account" />}
        />
        <Divider />
        <CustomTwoColumn
          first="To"
          second={<Hash hash={tx.receiver_account_id} type="account" />}
        />
        <Divider />
        <div class="bu-columns">
          <div class="bu-column bu-is-2">Actions</div>
          <div class="bu-column bu-has-text-weight-bold">
            {tx.actions.map((action) => (
              <div class="bu-columns">
                <div class="bu-column">
                  <Action name={action.receipt_action.action_kind} tx={tx} action={action} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Divider />
        <CustomTwoColumn first="Nonce" second={tx.nonce} />
        <Divider />
        <div style={{ color: '#3498db' }}>Click to see more ↓ </div>
      </Overview>
    </div>
  );
});
