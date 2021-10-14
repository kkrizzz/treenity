const InstructionBadge = render(null, 'instruction', 'react-text');
const Hash = render('dev', 'hash');
const TimeAgo = render('dev', 'time-ago');
const Action = render('near_action', '', 'react-table');
const Icon = render('near_action', 'icon');

const MethodBadge = ({ method }) => {
  return <div class="bu-tag bu-is-light">{method}</div>;
};

const types = {};

add(
  ({
    tx: { transaction_hash, block_timestamp, signer_account_id, receiver_account_id, ...rest },
  }) => {
    return (
      <div className="bu-columns bu-is-mobile" style={{ textAlign: 'left' }}>
        <div className="bu-column bu-is-1" style={{ width: '10%' }}>
          <div
            style={{
              height: '40px',
              width: '40px',
              background: 'rgba(119,131,143,.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="bu-mr-2"
          >
            TX
          </div>
        </div>

        <div className="bu-column bu-is-one-third" style={{ width: '30%' }}>
          <div style={{ maxWidth: 150 }}>
            <Hash type="transaction" hash={transaction_hash} />
          </div>
          <div className="bu-is-size-7">
            <TimeAgo date={new Date(block_timestamp / 1000000)} />
          </div>
        </div>
        <div className="bu-column bu-is-one-third" style={{ width: '30%' }}>
          <Hash type="account" hash={signer_account_id} threshold={14} suffixLen={0} />
        </div>
        <div className="bu-column bu-is-one-third" style={{ width: '30%' }}>
          <Hash type="account" hash={receiver_account_id} threshold={14} suffixLen={0} />
        </div>
      </div>
    );
  },
);
