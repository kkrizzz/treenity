const nearUtils = await require('solarea://near/utils');
const Icon = render('dashboard', 'icon');

add(({ contract }) => {
  const [tokenMetadata, isTokenMetadataLoading] = nearUtils.useNearTokenMetadata(contract);
  if (isTokenMetadataLoading) return 'Loading ...';
  if (!tokenMetadata) return '-';
  return (
    <div className="bu-is-flex bu-is-flex-direction-row bu-is-align-items-center">
      <div class="bu-mr-1">
        <figure className="bu-image bu-is-16x16">
          {tokenMetadata.icon ? <img src={tokenMetadata.icon} /> : <Icon type="defaultToken" />}
        </figure>
      </div>
      <span>{tokenMetadata.symbol}</span>
    </div>
  );
});
