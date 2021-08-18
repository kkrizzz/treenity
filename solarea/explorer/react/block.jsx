const { lpsRound, numberWithSpaces } = await require('solarea://explorer/utils');

const { useBlock } = solarea;

const AddressLabel = render('', 'name', 'react-text');
const BulmaCard = render('dev', 'bulma-card', 'react');
const Tabs = render('dev', 'tabs', 'react');
const Link = render('dev', 'link');
const TwoColumn = render('dev', 'two-column');
const TransactionRow = render('explorer', 'transaction', 'react-table');

const SolanaBlockView = ({ entityId }) => {
  const [block, loading] = useBlock(+entityId);
  const [showAmount, setShowAmount] = React.useState(10);

  if (loading) {
    return (
      <div className="bu-container bu-is-max-desktop">
        <BulmaCard
          header={
            <div className="flex-between">
              <div class="m-r-16">Block </div>
              <progress className="bu-progress bu-is-small bu-is-success" max="100">
                100%
              </progress>
            </div>
          }
        />
      </div>
    );
  }
  const transactions = block.transactions;

  const successfulTransactions = transactions.reduce((acc, val) => {
    if (!val.meta.err) acc += 1;
    return acc;
  }, 0);

  const parentSlot = block.parentSlot;
  return (
    <div class="bu-container bu-is-max-desktop">
      <BulmaCard header={<div class="flex-between">Block</div>} />
      <BulmaCard header="Overview">
        <div class="bu-columns" style={{ overflowY: 'auto' }}>
          <div class="bu-column">
            <TwoColumn first="Slot" second={entityId} />
            <TwoColumn first="Blockhash" second={block.blockhash} />
            <TwoColumn first="Parent slot" link={`/blocks/${parentSlot}`} second={parentSlot} />
            <TwoColumn first="Processed transactions" second={transactions.length} />
            <TwoColumn first="Successful transactions" second={successfulTransactions} />
          </div>
        </div>
      </BulmaCard>
      <BulmaCard>
        <Tabs
          tabs={[
            {
              name: 'Block transactions',
              content: () => (
                <div>
                  <div>
                    <div className="bu-columns">
                      <div className="bu-column bu-is-4">Signature</div>
                      <div className="bu-column bu-is-6">Instructions</div>
                      <div className="bu-column bu-is-2">Result</div>
                    </div>

                    {transactions.slice(0, showAmount).map((t, i) => (
                      <TransactionRow key={i} transaction={t} />
                    ))}
                  </div>
                  {showAmount < transactions.length && (
                    <button
                      class="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16"
                      onClick={() => setShowAmount((am) => am + 10)}
                    >
                      Load more...
                    </button>
                  )}
                </div>
              ),
            },
            {
              name: 'Block rewards',
              content: () => (
                <div>
                  <div className="bu-columns bu-is-mobile">
                    <div className="bu-column bu-is-8">Address</div>
                    <div className="bu-column bu-is-2">Type</div>
                    <div className="bu-column bu-is-2">Amount</div>
                  </div>
                  {block.rewards.map((reward) => (
                    <div className="bu-columns bu-is-mobile">
                      <div className="bu-column bu-is-8 text-overflow">
                        <Link to={`/address/${reward.pubkey}`}>{reward.pubkey}</Link>
                      </div>
                      <div className="bu-column bu-is-2">{reward.rewardType}</div>
                      <div className="bu-column bu-is-2">{lpsRound(reward.lamports)}</div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </BulmaCard>
    </div>
  );
};

const BlockLoadingView = () => {
  return (
    <div className="bu-container bu-is-max-desktop">
      <BulmaCard
        header={
          <div className="flex-between">
            <div className="m-r-16">Block</div>
            <progress className="bu-progress bu-is-small bu-is-success" max="100">
              100%
            </progress>
          </div>
        }
      />
    </div>
  );
};

const EthereumBlockView = ({ entityId }) => {
  const [block, isLoading] = solarea.useSolanaRpc(
    'eth_getBlockByNumber',
    '0x' + Number(entityId).toString(16),
    true,
  );

  if (isLoading || !block) {
    return <BlockLoadingView />;
  }

  const parse16 = (number) => {
    return parseInt(number, 16);
  };

  return (
    <div className="bu-container bu-is-max-desktop">
      <BulmaCard header={<div class="flex-between">Block</div>} />
      <BulmaCard header="Overview">
        <div class="bu-columns" style={{ overflowY: 'auto' }}>
          <div class="bu-column">
            <TwoColumn first="Block height" second={entityId} />
            <TwoColumn first="Block hash" second={block.hash} />
            <TwoColumn
              first="Mined by"
              second={<AddressLabel fallback={() => block.miner} id={block.miner}></AddressLabel>}
              link={`/address/${block.miner}`}
            />
            <TwoColumn first="Size" second={parse16(block.size) + '\tbytes'} />
            <TwoColumn first="Num of transactions" second={block.transactions.length} />
            <TwoColumn first="Difficulty" second={parse16(block.difficulty)} />
            <TwoColumn first="Nonce" second={block.nonce} />
            <TwoColumn first="Gas used" second={parse16(block.gasUsed)} />
          </div>
        </div>
      </BulmaCard>
      <BulmaCard header="Transactions">
        <div className="bu-columns bu-is-mobile">
          <div className="bu-column bu-is-4">Hash</div>
          <div className="bu-column bu-is-4">From</div>
          <div className="bu-column bu-is-4">To</div>
        </div>
        {block.transactions.map((tx) => {
          const { hash, to, from } = tx;

          return (
            <div className="bu-columns bu-is-mobile">
              <div className="bu-column bu-is-4 text-overflow" link={`/tx/${hash}`}>
                {hash}
              </div>
              <div className="bu-column bu-is-4 text-overflow" link={`/address/${from}`}>
                {from}
              </div>
              <div className="bu-column bu-is-4 text-overflow" link={`/address/${to}`}>
                {to}
              </div>
            </div>
          );
        })}
      </BulmaCard>
    </div>
  );
};

const blockByChain = {
  evm: EthereumBlockView,
  sol: SolanaBlockView,
};

add(({ entityId, chain }) => {
  if (!chain) chain = 'sol';

  return blockByChain[chain]({ entityId });
});
