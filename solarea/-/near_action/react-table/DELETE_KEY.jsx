const Link = render('dev', 'link');
const TxDesc = render('near', 'tx-description');

add(({ tx, action }) => {
  const { public_key } = action.args;
  const length = public_key.length;

  return (
    <TxDesc tx={tx}>
      Key deleted:
      {public_key.slice(0, 4) + '...' + public_key.slice(public_key.length - 4, public_key.length)}
    </TxDesc>
  );
});
