const nearUtils = await require('solarea://near/utils');
const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');
const Table = render('dev', 'table');
const Overview = render('near', 'overview');
const Divider = render('near', 'divider');

const CustomTwoColumn = ({ first, second, link }) => (
  <TwoColumn first={first} second={second} link={link} is={2} isTextRight={false} />
);

const Wrapper = render('near', 'wrapper');

const tsxTableColumn = [
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
    dataIndex: 'signer_account_id',
    render: (hash) => (
      <div style={{ maxWidth: 200 }}>
        <Hash hash={hash} type="account" />
      </div>
    ),
  },
  {
    title: 'To',
    dataIndex: 'receiver_account_id',
    render: (hash) => (
      <div style={{ maxWidth: 200 }}>
        <Hash hash={hash} type="account" />
      </div>
    ),
  },
  {
    title: 'Action',
    dataIndex: 'action_kind',
    render: (hash) => <div style={{ maxWidth: 200 }}>{hash}</div>,
  },
];

add(({ entityId }) => {
  const [blockFromIndexer, isBlockFromIndexerLoading] = nearUtils.useNearBlockFromIndexer(entityId);

  if (isBlockFromIndexerLoading) return 'Loading ...';
  console.log(blockFromIndexer);
  return (
    <Wrapper>
      <div className="bu-is-size-4 bu-is-flex bu-is-flex-direction-row bu-is-align-items-baseline bu-mb-5">
        <div>Block</div>
        <div class="bu-is-size-6 bu-has-text-grey bu-ml-2">#{entityId}</div>
      </div>
      <div className="bu-mb-4">
        <Overview>
          <div className="bu-columns">
            <div className="bu-column custom-header bu-mb-3 bu-has-text-grey-darker bu-has-text-weight-bold">
              Overview
            </div>
          </div>
          <CustomTwoColumn first="Height" second={entityId} />
          <Divider />
          <CustomTwoColumn
            first="Timestamp"
            s
            second={new Date(blockFromIndexer.block_timestamp / 1000000).toLocaleString()}
          />
          <Divider />
          <CustomTwoColumn first="Transactions" second={blockFromIndexer.transactions.length} />
          <Divider />
          <CustomTwoColumn
            first="Validated by"
            second={<Hash hash={blockFromIndexer.author_account_id} type="account" />}
          />
        </Overview>
      </div>
      <Overview>
        <div className="bu-columns">
          <div className="bu-column custom-header bu-mb-3 bu-has-text-grey-darker bu-has-text-weight-bold">
            Transactions
          </div>
        </div>
        <Table columns={tsxTableColumn} data={blockFromIndexer.transactions} />
      </Overview>
    </Wrapper>
  );
});
