const nearUtils = await require('solarea://near/utils');

add(({ contract, amount }) => {
  const [tokenMetadata, isTokenMetadataLoading] = nearUtils.useNearTokenMetadata(contract);
  if (isTokenMetadataLoading) return 'Loading ...';
  return (amount * Math.pow(10, -tokenMetadata.decimals)).toFixed(4);
});
