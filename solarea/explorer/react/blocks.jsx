const BulmaCard = render('dev', 'bulma-card');
const TwoColumn = render('dev', 'two-column');
const TimeAgo = render('dev', 'time-ago');
const Link = render('dev', 'link');
const ScrollBox = render('dev', 'scroll-box');
const Hash = render('dev', 'hash');

const SolanaBlocksView = () => {
  return <div>Hello, sol</div>;
};

function loadBlocks(connection, fromNumber, limit) {
  const requests = [];
  for (let i = 0; i < limit; i++) {
    const block = fromNumber - i;
    requests.push({ methodName: 'eth_getBlockByNumber', args: ['0x' + block.toString(16), false] });
  }
  return connection._rpcBatchRequest(requests).then((res) => res.map((r) => r.result));
}

const useVelasLoadBlocks = (blockNumber) => {
  const connection = solarea.useConnection();
  const { data: blocksData, isLoading: isBlocksLoading, fetchNextPage } = solarea.useInfiniteQuery(
    ['loadingBlocksFrom', blockNumber],
    ({ pageParam }) => loadBlocks(connection, pageParam || blockNumber, 10),
    {
      getNextPageParam: (lastPage) => parseInt(lastPage.at(-1).number) - 1,
    },
  );

  return [blocksData?.pages.flat(), isBlocksLoading, () => fetchNextPage()];
};

const InfoCard = (t) => (
  <div class="bu-container bu-is-max-desktop">
    <BulmaCard header={t} />
  </div>
);

const EvmBlocksView = () => {
  const [lastBlock, isBlockLoading] = solarea.useSolanaRpc('eth_blockNumber');
  if (isBlockLoading || !lastBlock) return InfoCard('Last block loading');
  const [blocks, isLoading, fetchNext] = useVelasLoadBlocks(parseInt(lastBlock));

  if (isLoading) return InfoCard('Blocks loading');
  return (
    <BulmaCard>
      <ScrollBox>
        <div className="bu-columns bu-is-mobile">
          <div className="bu-column bu-is-2-desktop bu-is-2-tablet bu-is-3-mobile">Block</div>
          <div className="bu-column bu-is-2-desktop bu-is-2-tablet bu-is-3-mobile">Age</div>
          <div className="bu-column bu-is-1-desktop bu-is-1-tablet bu-is-1-mobile">Txn</div>
          <div className="bu-column bu-is-5-desktop bu-is-5-tablet bu-is-3-mobile">Hash</div>
          <div className="bu-column bu-is-2-desktop bu-is-2-tablet bu-is-2-mobile">Gas Used</div>
        </div>
        {blocks.map((block) => {
          const number = parseInt(block.number, 16);

          return (
            <div key={block.hash}>
              <div className="bu-columns bu-is-mobile">
                <div className="bu-column bu-is-2-desktop bu-is-2-tablet bu-is-3-mobile">
                  <Hash hash={number.toString()} type="block" urlParams="chain=evm" />
                </div>
                <div className="bu-column bu-is-2-desktop bu-is-2-tablet bu-is-3-mobile">
                  <TimeAgo date={new Date(parseInt(block.timestamp) * 1000)} />
                </div>
                <div className="bu-column bu-is-1-desktop bu-is-1-tablet bu-is-1-mobile">
                  {block.transactions.length}
                </div>

                <div className="bu-column bu-is-5-desktop bu-is-5-tablet bu-is-3-mobile text-overflow">
                  <Hash hash={number.toString()} type="block" urlParams="chain=evm">
                    {block.hash}
                  </Hash>
                </div>
                <div className="bu-column bu-is-1-desktop bu-is-2-tablet bu-is-2-mobile">
                  {parseInt(block.gasUsed)}
                </div>
              </div>
            </div>
          );
        })}
      </ScrollBox>
      <button
        className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16"
        onClick={fetchNext}
      >
        Load more...
      </button>
    </BulmaCard>
  );
};

const chainBlockTypes = {
  evm: EvmBlocksView,
  sol: SolanaBlocksView,
};

add(({ chain }) => {
  if (!chain) chain = 'sol';

  const TargetType = chainBlockTypes[chain];

  return (
    <Render id="explorer" name="layout">
      <div className="bu-container bu-is-max-desktop">
        <BulmaCard header="Latest blocks" />
        <TargetType />
      </div>
    </Render>
  );
});
