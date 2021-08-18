const BulmaCard = render('dev', 'bulma-card');
const TwoColumn = render('dev', 'two-column');
const TimeAgo = render('dev', 'time-ago');
const Link = render('dev', 'link');
const AddressLabel = render('', 'name', 'react-text');

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
      <div className="bu-columns bu-is-mobile">
        <div className="bu-column bu-is-1-desktop bu-is-1-tablet bu-is-2-mobile">Block</div>
        <div className="bu-column bu-is-10-desktop bu-is-10-tablet bu-is-8-mobile">Hash</div>
        <div className="bu-column bu-is-1-desktop bu-is-2-mobile">txns</div>
      </div>
      {blocks.map((block) => {
        const number = parseInt(block.number, 16);

        return (
          <div key={block.hash}>
            <div className="bu-columns bu-is-mobile">
              <div className="bu-column bu-is-1-desktop bu-is-1-tablet bu-is-2-mobile">
                <Link to={`/block/${number}?chain=evm`}>{number}</Link>
              </div>
              <div className="bu-column bu-is-10-desktop bu-is-10-tablet bu-is-8-mobile text-overflow">
                {block.hash}
                <div class="bu-columns">
                  <div className="bu-column">
                    <TimeAgo date={new Date(parseInt(block.timestamp) * 1000)} />
                  </div>
                  <div class="bu-column">Gas used: {parseInt(block.gasUsed)}</div>
                </div>
              </div>
              <div className="bu-column bu-is-1-desktop bu-is-2-mobile">
                {block.transactions.length}
              </div>
            </div>
          </div>
        );
      })}
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
