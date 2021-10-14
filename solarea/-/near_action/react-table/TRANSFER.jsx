const Hash = render('dev', 'hash');
const { nearHumanBalance } = await require('solarea://near/utils');

add(({ tx, action }) => {
  const receiverAccId = action.receipt_action.receipt_receiver_account_id;
  const signerAccId = action.receipt_action.receipt_predecessor_account_id;
  if (signerAccId === 'system') {
  }
  return (
    <div>
      Transferred {nearHumanBalance(action.receipt_action.args.deposit)} from{' '}
      <div style={{ display: 'inline-block' }}>
        <Hash hash={signerAccId} type="account" />
      </div>{' '}
      to{' '}
      <div style={{ display: 'inline-block' }}>
        <Hash hash={receiverAccId} type="account" />
      </div>
    </div>
  );
});
