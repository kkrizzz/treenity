const Hash = render('dev', 'hash');
const TokenAmount = render('near', 'token-amount', 'react-list');
const TokenName = render('near', 'token', 'react-list');

add(({ tx, action }) => {
  const receiptAction = action.receipt_action;
  const receiverAccountId = receiptAction.receipt_receiver_account_id;
  const predecessorAccountId = receiptAction.receipt_predecessor_account_id;

  if (receiptAction.args.method_name === 'ft_transfer') {
    return (
      <div class="bu-is-flex bu-is-flex-direction-row bu-is-align-items-center">
        Transferred{' '}
        <div class="bu-ml-1 bu-mr-1 bu-is-flex">
          <div class="bu-mr-1">
            <TokenAmount
              contract={receiverAccountId}
              amount={receiptAction.args.args_json.amount}
            />
          </div>
          <TokenName contract={receiverAccountId} />
        </div>
        <div class="bu-mr-1 bu-is-flex">
          from <Hash hash={predecessorAccountId} type="new-account" />
        </div>
        <div class="bu-is-flex">
          to <Hash hash={receiptAction.args.args_json.receiver_id} />
        </div>
      </div>
    );
  }

  return (
    <div>
      Called method <b>"{receiptAction.args.method_name}"</b> in{' '}
      <div style={{ display: 'inline-block' }}>
        <Hash hash={receiverAccountId} type="account" />
      </div>
    </div>
  );
});
