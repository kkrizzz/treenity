const BulmaCard = render('dev', 'bulma-card');
const TwoColumn = render('dev', 'two-column');
const Link = render('dev', 'link');
const AddressLabel = render('', 'name', 'react-text');

const SolanaBlocksView = () => {
  return <div>Helo, sol</div>;
};

const useLoadBlocks = (blockNumber) => {
  const { data: blocksData, isLoading: isBlocksLoading, fetchNextPage } = solarea.useInfiniteQuery(
    ['loadingBlocksFrom', blockNumber],
    ({ pageParam }) =>
      globalThis
        .fetch('https://api.velas.com/', {
          method: 'POST',
          body: JSON.stringify({
            id: 4,
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: ['0x' + (pageParam || blockNumber).toString(16), false],
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => res.json()),
    {
      getNextPageParam: (lastPage, pages) => parseInt(lastPage.result.number) - 1,
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
  const [blocks, isLoading, fetchNext] = useLoadBlocks(68149);

  React.useEffect(() => {
    if (!isLoading) {
      (async function () {
        for (let i = 0; i < 10; i++) {
          await fetchNext();
        }
      })();
    }
  }, [isLoading]);

  if (isLoading) return InfoCard('Blocks loading');
  return (
    <BulmaCard>
      <div className="bu-columns bu-is-mobile">
        <div className="bu-column bu-is-8">Hash</div>
        <div className="bu-column bu-is-2">Block</div>
        <div className="bu-column bu-is-2">Transactions</div>
      </div>
      {blocks.map(({ result: block }) => {
        const number = parseInt(block.number, 16);

        return (
          <div>
            <div className="bu-columns bu-is-mobile">
              <div className="bu-column bu-is-8 text-overflow">
                <Link to={`/block/${number}?chain=evm`}>{block.hash}</Link>
              </div>
              <div className="bu-column bu-is-2">{number}</div>
              <div className="bu-column bu-is-2">{block.transactions.length}</div>
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
