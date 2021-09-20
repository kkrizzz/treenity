const Icon = render('near_action', 'icon');

add(({ tx, children }) => {
  const actionKind = tx.action_kind;
  return (
    <div>
      {children}
      <div className="bu-is-size-7 bu-has-text-grey-light bu-mb-2 bu-has-text-weight-bold">
        by {tx.signer_account_id}
      </div>
    </div>
  );
});
