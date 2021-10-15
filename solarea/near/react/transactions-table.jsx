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
const Wrapper = styled.div([
  css`
    .latest-info {
      background: white;
      background: white;
      padding-left: 0.75rem;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }

    .bu-tabs ul {
      border: none;
    }

    .bu-tabs .bu-is-active {
      opacity: 1;
      color: #000000 !important;
      background: #ffffff;
      border-bottom: 1px solid black;
    }

    .bu-tabs {
      color: black;
      margin-bottom: 0;
      background: white;
    }

    .bu-tabs li {
      color: rgba(74, 79, 85, 0.8);
      border-radius: 0;
      padding: 0.75rem;
      font-size: 14px;
    }

    table {
      border-radius: 0;
    }

    tbody,
    thead {
      background: white !important;
    }

    th,
    td {
      border-bottom: 1px solid #e7eaf3;
      border-collapse: collapse;
    }

    tbody tr:nth-child(even) {
      background-color: white;
    }

    .tabs-wrapper {
      border-radius: 0.5rem;
    }

    tr td {
      font-size: 14px !important;
      padding: 0.75rem;
    }
  `,
]);

const LPS = 0.000000000000000000000001;

const txHashColumn = {
  title: 'Hash',
  dataIndex: 'transaction_hash',
  render: (hash) => (
    <div style={{ maxWidth: 100 }}>
      <Hash hash={hash} type="transaction" />
    </div>
  ),
};

const txFromColumn = {
  title: 'From',
  dataIndex: 'signer_account_id',
  render: (from) => (
    <div style={{ maxWidth: 200 }}>
      <Hash hash={from} type="account" />
    </div>
  ),
};

const txToColumn = {
  title: 'To',
  dataIndex: 'receiver_account_id',
  render: (to, item) => (
    <div style={{ maxWidth: 200 }}>
      <Hash hash={to} type="account" />
    </div>
  ),
};

const txTimestampColumn = {
  title: 'Timestamp',
  dataIndex: 'block_timestamp',
  render: (timestamp) => new Date(timestamp / 1000000).toLocaleString(),
};

const transactionColumns = {
  unknown: [
    txHashColumn,
    txFromColumn,
    txToColumn,
    { title: 'Action', dataIndex: 'action_kind' },
    txTimestampColumn,
  ],
  transfer: [
    txHashColumn,
    txFromColumn,
    txToColumn,
    {
      title: 'Amount',
      dataIndex: 'args',
      render: (args) => (args.deposit * LPS).toFixed(4),
    },
    txTimestampColumn,
  ],
  tokenTransfers: [
    txHashColumn,
    {
      title: 'From',
      dataIndex: 'args',
      render: (args, tx) => (
        <Hash
          hash={args.method_name === 'withdraw' ? tx.receiver_account_id : tx.signer_account_id}
          type="account"
        />
      ),
    },
    {
      title: 'To',
      dataIndex: 'args',
      render: (args, tx) => (
        <Hash
          hash={args.method_name === 'withdraw' ? tx.signer_account_id : args.args_json.receiver_id}
          type="account"
        />
      ),
    },
    {
      title: 'Token',
      dataIndex: 'receiver_account_id',
      render: (contract, tx) => (
        <div className="bu-has-text-left">
          <Token
            contract={
              tx.args.method_name === 'withdraw'
                ? tx.args.args_json.token_id
                : tx.receiver_account_id
            }
          />
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'args',
      render: (args, tx) => (
        <TokenAmount
          contract={
            args.method_name === 'withdraw' ? args.args_json.token_id : tx.receiver_account_id
          }
          amount={args.args_json.amount}
        />
      ),
    },
    txTimestampColumn,
  ],
};

add(({ txs }) => {
  const TX_ACTIONS_KIND = {
    transfer: ['TRANSFER'],
    tokenTransfers: ['FUNCTION_CALL'],
  };

  const tabs = [
    {
      name: 'Transfers',
      content: () => {
        const transfersTxs = txs.rows.filter((i) =>
          TX_ACTIONS_KIND.transfer.includes(i.action_kind),
        );
        if (transfersTxs.length)
          return (
            <ScrollBox>
              <Table columns={transactionColumns.transfer} data={transfersTxs} />
            </ScrollBox>
          );
        return 'No transfers';
      },
    },
    {
      name: 'Token transfers',
      content: () => (
        <ScrollBox>
          <Table
            columns={transactionColumns.tokenTransfers}
            data={txs.rows.filter(
              (i) =>
                TX_ACTIONS_KIND.tokenTransfers.includes(i.action_kind) &&
                (i.args.method_name === 'ft_transfer_call' || i.args.method_name === 'withdraw'),
            )}
          />
        </ScrollBox>
      ),
    },
    { name: 'Internal txs' },
  ];

  return (
    <Wrapper>
      <div class="tabs-wrapper">
        <Tabs tabs={tabs} />
      </div>
    </Wrapper>
  );
});
