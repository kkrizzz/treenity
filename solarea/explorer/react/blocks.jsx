const BulmaCard = render('dev', 'bulma-card');
const TwoColumn = render('dev', 'two-column');
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
    <div>
      {blocks.map(({ result: block }) => {
        const number = parseInt(block.number, 16);

        return (
          <BulmaCard header={`Block #${number}`}>
            <TwoColumn first="Number" second={number} link={`/block/${number}?chain=evm`} />
            <TwoColumn first="Transactions" second={block.transactions.length} />
            <TwoColumn first="Hash" second={block.hash} />
            <TwoColumn
              first="Mined by"
              second={<AddressLabel fallback={() => block.miner} id={block.miner}></AddressLabel>}
              link={`/address/${block.miner}`}
            />
          </BulmaCard>
        );
      })}
      <button
        className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16"
        onClick={fetchNext}
      >
        Load more...
      </button>
    </div>
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
