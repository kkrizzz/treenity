const nearUtils = await require('solarea://near/utils');
await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Overview = render('near', 'overview');
const Block = render('near', 'block', 'react-list');

add(() => {
  const [showCount, setShowCount] = React.useState(10);
  const [latestBlocks, isLatestBlocksLoading] = nearUtils.useNearLatestBlocks(showCount);

  return (
    <div className="bu-columns" style={{ marginTop: 16 }}>
      <div className="bu-column bu-is-12">
        <Overview>
          <div className="bu-columns bu-mb-3">
            <div className="bu-column custom-header bu-has-text-grey-darker bu-has-text-weight-bold">
              Latest blocks
            </div>
            <div className="bu-column custom-header bu-has-text-grey-darker bu-has-text-weight-bold">
              Validator
            </div>
          </div>
          {!isLatestBlocksLoading && latestBlocks.map((i) => <Block block={i} />)}
          <button
            className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16"
            onClick={() => setShowCount((count) => count + 10)}
          >
            View more
          </button>
        </Overview>
      </div>
    </div>
  );
});
