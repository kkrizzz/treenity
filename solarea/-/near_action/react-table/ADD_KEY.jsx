const Link = render('dev', 'link');
const TxDesc = render('near', 'tx-description');

add(({ tx, action }) => {
  const args = action.receipt_action.args;
  const publicKey = args.public_key;

  const receiverId = args.access_key.permission.permission_details?.receiver_id;

  return (
    <div>
      Access key added for contract{' '}
      <span style={{ marginLeft: 4 }}>
        <Link to={`account/${receiverId}`}>{receiverId}</Link>
      </span>
      :
      {publicKey && (
        <span style={{ marginLeft: 4 }}>
          <Link hash={publicKey}>
            {publicKey.slice(0, 4) +
              '...' +
              publicKey.slice(publicKey.length - 4, publicKey.length)}
          </Link>
        </span>
      )}
    </div>
  );
});
