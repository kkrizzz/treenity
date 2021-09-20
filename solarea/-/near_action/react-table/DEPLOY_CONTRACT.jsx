const TxDesc = render('near', 'tx-description');

add(({ tx, action }) => {
  const isStatusSuccess = tx.status === 'SUCCESS_RECEIPT_ID';
  const receiverAccountId = tx.receiver_account_id;

  return (
    <TxDesc tx={tx}>
      {isStatusSuccess ? 'Contract deployed' : 'Error when deploying contract'}: {receiverAccountId}
    </TxDesc>
  );
});
