const Hash = render('dev', 'hash');
const TimeAgo = render('dev', 'time-ago');
const Action = render('near_action', '', 'react-table');
const Icon = render('near_action', 'icon');

const MethodBadge = ({ method }) => {
  return <div class="bu-tag bu-is-light">{method}</div>;
};

const types = {};

add(({ block: { block_height, block_timestamp, author_account_id, txs } }) => {
  return (
    <div className="bu-columns bu-is-mobile" style={{ textAlign: 'left' }}>
      <div className="bu-column bu-is-1" style={{ width: '10%' }}>
        <div
          style={{
            height: '40px',
            width: '40px',
            background: 'rgba(119,131,143,.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="bu-mr-2"
        >
          BL
        </div>
      </div>

      <div className="bu-column">
        <Hash type="block" hash={block_height} />
        <div className="bu-is-size-7">
          <div style={{ display: 'inline-block', width: 40 }}>{txs?.length || 0} txs</div>{' '}
          <TimeAgo date={new Date(block_timestamp / 1000000)} />
        </div>
      </div>

      <div className="bu-column bu-is-6">
        <Hash type="account" hash={author_account_id} suffixLen={0}>
          {author_account_id}
        </Hash>
      </div>
    </div>
  );
});
