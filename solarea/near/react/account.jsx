const {
  useAccount: useNearAccount,
  nearHumanBalance,
  useNearNFT,
  useNearAccTransactions,
  useNearTokens,
  useNearCoinData,
} = await require('solarea://near/utils');

const NewAccountTokens = render('near', 'new-account-tokens');
const Tabs = render('dev', 'tabs');
const Table = render('dev', 'table');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');
const TransactionRow = render('near', 'transaction', 'react-table');
const ScrollBox = render('dev', 'scroll-box');
const DashboardSection = render('dev', 'dashboard-section');
const AccountNFTs = render('near', 'new-account-nfts');
const DashboardCard = render('dev', 'dashboard-card');
const AccountName = render('', 'name', 'react-text');
const Overview = render('near', 'overview');
const Token = render('near', 'token', 'react-list');
const TokenAmount = render('near', 'token-amount', 'react-list');

const { Buffer, borsh } = solarea;

const Divider = render('near', 'divider');
const Wrapper = render('near', 'wrapper');

const LPS = 0.000000000000000000000001;

const txHashColumn = {
  title: 'Hash',
  dataIndex: 'receipt',
  render: (receipt) => (
    <div style={{ maxWidth: 100 }}>
      <NamedHash hash={receipt.originated_from_transaction_hash} type="transaction" />
    </div>
  ),
};

const txFromColumn = {
  title: 'From',
  dataIndex: 'receipt',
  render: (receipt) => (
    <div style={{ maxWidth: 200 }}>
      <NamedHash hash={receipt.predecessor_account_id} type="account" />
    </div>
  ),
};

const txToColumn = {
  title: 'To',
  dataIndex: 'receipt',
  render: (receipt) => (
    <div style={{ maxWidth: 200 }}>
      <NamedHash hash={receipt.receiver_account_id} type="account" />
    </div>
  ),
};

const txTimestampColumn = {
  title: 'Timestamp',
  dataIndex: 'receipt',
  render: (receipt) => new Date(receipt.included_in_block_timestamp / 1000000).toLocaleString(),
};

const transactionColumns = {
  unknown: [
    {
      title: 'Hash',
      dataIndex: 'transaction_hash',
      render: (hash) => (
        <div style={{ maxWidth: 100 }}>
          <Hash hash={hash} type="transaction" />
        </div>
      ),
    },
    {
      title: 'From',
      dataIndex: 'actions',
      render: (actions) => (
        <div style={{ maxWidth: 100 }}>
          <NamedHash hash={actions[0].receipt.predecessor_account_id} type="account" />
        </div>
      ),
    },
    {
      title: 'To',
      dataIndex: 'actions',
      render: (actions) => (
        <div style={{ maxWidth: 100 }}>
          <NamedHash hash={actions[0].receipt.receiver_account_id} type="account" />
        </div>
      ),
    },
    {
      title: 'Timestamp',
      dataIndex: 'block_timestamp',
      render: (timestamp) => new Date(timestamp / 1000000).toLocaleString(),
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (actions) => actions[0].receipt_action.action_kind,
    },
  ],
  transfer: [
    txHashColumn,
    txFromColumn,
    txToColumn,
    {
      title: 'Amount',
      dataIndex: 'receipt_action',
      render: (receiptAction) => (receiptAction.args.deposit * LPS).toFixed(6) + ' Ⓝ',
    },
    txTimestampColumn,
  ],
  tokenTransfers: [
    txHashColumn,
    {
      title: 'Method',
      dataIndex: 'receipt_action',
      render: (receiptAction) => (
        <div class="bu-tag" style={{ background: '#f3f6ff', color: '#000' }}>
          {receiptAction.args.method_name}
        </div>
      ),
    },
    {
      title: 'From',
      dataIndex: 'receipt_action',
      render: (receiptAction) => (
        <Hash hash={receiptAction.receipt_predecessor_account_id} type="account" />
      ),
    },
    {
      title: 'To',
      dataIndex: 'receipt_action',
      render: (receiptAction) => (
        <Hash hash={receiptAction.args.args_json.receiver_id} type="account" />
      ),
    },
    {
      title: 'Token',
      dataIndex: 'receipt_action',
      render: (receiptAction) => (
        <div className="bu-has-text-left">
          <Token contract={receiptAction.receipt_receiver_account_id} />
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'receipt_action',
      render: (receiptAction) => (
        <TokenAmount
          contract={receiptAction.receipt_receiver_account_id}
          amount={receiptAction.args.args_json.amount}
        />
      ),
    },
    txTimestampColumn,
  ],
};

add(({ entityId }) => {
  if (entityId === 'system')
    return (
      <Wrapper>
        <div class="bu-is-size-4 bu-is-flex bu-is-flex-direction-row bu-is-align-items-center bu-mb-5">
          Account
          <div class="bu-is-size-5 bu-has-text-grey bu-ml-2">{entityId}</div>
        </div>
      </Wrapper>
    );
  const [accData, isAccDataLoading] = useNearAccount(entityId);
  const [txs, isTxsLoading] = useNearAccTransactions(entityId, 50, 0);
  const [nearCoinData, isNearCoinDataLoading] = useNearCoinData();

  if (isAccDataLoading) return <div>Loading . . .</div>;

  console.log(txs);

  const AccountOverview = () => (
    <Overview>
      <div class="bu-columns">
        <div class="bu-column custom-header bu-mb-3 bu-has-text-grey-darker bu-has-text-weight-bold">
          Overview
        </div>
      </div>
      <div class="bu-columns">
        <div class="bu-column bu-is-4">Balance</div>
        <div class="bu-column">{nearHumanBalance(accData.amount)}</div>
      </div>
      <Divider />
      <div className="bu-columns">
        <div className="bu-column bu-is-4">USD value</div>
        <div className="bu-column">
          {isNearCoinDataLoading
            ? 'loading'
            : '$' + (nearCoinData.market_data.current_price.usd * LPS * accData.amount).toFixed(4)}
        </div>
      </div>
    </Overview>
  );

  const MoreInfo = () => (
    <Overview>
      <div class="bu-columns">
        <div class="bu-column custom-header bu-mb-3 bu-has-text-grey-darker bu-has-text-weight-bold">
          Tokens
        </div>
      </div>
      <div className="bu-column" style={{ maxHeight: 100, overflowY: 'auto' }}>
        <NewAccountTokens entityId={entityId} />
      </div>
    </Overview>
  );

  const TX_ACTIONS_KIND = {
    transfer: ['TRANSFER'],
    tokenTransfers: ['FUNCTION_CALL'],
  };

  const tabs = [
    {
      name: 'Transfers',
      content: () => {
        const transfersTxs = txs
          .map((tx) => {
            return (
              tx.actions &&
              tx.actions.filter(
                ({ receipt, receipt_action }) =>
                  TX_ACTIONS_KIND.transfer.includes(receipt_action.action_kind) &&
                  receipt.predecessor_account_id !== 'system',
              )
            );
          })
          .flat();

        if (transfersTxs.length)
          return (
            <ScrollBox>
              <Table columns={transactionColumns.transfer} data={transfersTxs} />
            </ScrollBox>
          );

        return <Overview>No transfers</Overview>;
      },
    },
    // {
    //   name: 'Internal transfers',
    //   content: () => {
    //     const transfersTxs = txs
    //       .map((i) => {
    //         return i.actions.filter(({ receipt_action }) =>
    //           TX_ACTIONS_KIND.transfer.includes(receipt_action.action_kind),
    //         );
    //       })
    //       .flat();
    //
    //     if (transfersTxs.length)
    //       return (
    //         <ScrollBox>
    //           <Table columns={transactionColumns.transfer} data={transfersTxs} />
    //         </ScrollBox>
    //       );
    //     return 'No transfers';
    //   },
    // },
    {
      name: 'Token transfers',
      content: () => {
        const tokenTransfers = txs
          .map((i) => {
            return i.actions.filter(
              ({ receipt_action }) =>
                TX_ACTIONS_KIND.tokenTransfers.includes(receipt_action.action_kind) &&
                (receipt_action.args.method_name === 'ft_transfer' ||
                  receipt_action.args.method_name === 'ft_transfer_call') &&
                receipt_action.args.method_name !== 'near_deposit',
            );
          })
          .flat();
        if (tokenTransfers.length)
          return (
            <ScrollBox>
              <Table columns={transactionColumns.tokenTransfers} data={tokenTransfers} />
            </ScrollBox>
          );

        return <Overview>No token transfers</Overview>;
      },
    },
    {
      name: 'Transactions',
      content: () => {
        if (txs.length)
          return (
            <ScrollBox>
              <Table columns={transactionColumns.unknown} data={txs} />
            </ScrollBox>
          );

        return <Overview>No transactions</Overview>;
      },
    },
    { name: 'NFTs', content: () => <AccountNFTs entityId={entityId} /> },
  ];

  return (
    <Wrapper>
      <div class="bu-is-size-4 bu-is-flex bu-is-flex-direction-row bu-is-align-items-center bu-mb-5">
        Account
        <div class="bu-is-size-5 bu-has-text-grey bu-ml-2">{entityId}</div>
      </div>
      <div class="bu-columns">
        <div class="bu-column bu-is-6">
          <AccountOverview />
        </div>
        <div class="bu-column bu-is-6">
          <MoreInfo />
        </div>
      </div>
      <div class="tabs-wrapper">
        {isTxsLoading ? (
          <div>
            Loading transactions ...
            <span className="spinner-grow spinner-grow-sm m-r-4" />
          </div>
        ) : (
          <Tabs tabs={tabs} />
        )}
      </div>
    </Wrapper>
  );
});
