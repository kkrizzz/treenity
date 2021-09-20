const Hash = render('dev', 'hash');

add(({ tx, action }) => {
  const receiverAccountId = tx.receiver_account_id;
  return (
    <div>
      Called method <b>"{action.args.method_name}"</b> in{' '}
      <div style={{ display: 'inline-block' }}>
        <Hash hash={receiverAccountId} type="account" />
      </div>
    </div>
  );
});
