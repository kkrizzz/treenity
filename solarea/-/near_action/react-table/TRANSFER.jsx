const Hash = render('dev', 'hash');
const { nearHumanBalance } = await require('solarea://near/utils');

add(({ tx, action }) => {
  const receiverAccId = tx.receiver_account_id;
  const signerAccId = tx.signer_account_id;
  return (
    <div>
      Transferred {nearHumanBalance(action.args.deposit)} from{' '}
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
