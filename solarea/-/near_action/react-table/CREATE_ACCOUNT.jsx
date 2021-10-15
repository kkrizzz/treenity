const Hash = render('dev', 'hash');

add(({ tx, action }) => {
  return (
    <div style={{ display: 'flex' }}>
      Created account{' '}
      <Hash hash={action.receipt_action.receipt_receiver_account_id} type="account" />
    </div>
  );
});
