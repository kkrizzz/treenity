const {
  useAccount: useNearAccount,
  nearHumanBalance,
  useNearNFT,
  useNearAccTransactions,
  useNearTokens,
} = await require('solarea://near/utils');

const useResolveNftMedia = (token, collection) => {
  const [url, setUrl] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async function () {
      const tokenMetadataMedia = token.metadata.media;
      const baseUri = collection.metadata.base_uri;

      if (!tokenMetadataMedia && !baseUri) {
        setUrl('');
        return setIsLoading(false);
      }

      if (tokenMetadataMedia && tokenMetadataMedia.startsWith('bafy')) {
        setUrl(`https://ipfs.fleek.co/ipfs/${tokenMetadataMedia}`);
      } else if (tokenMetadataMedia && tokenMetadataMedia.startsWith('http')) {
        setUrl(tokenMetadataMedia);
      } else if (baseUri && baseUri.includes('arweave')) {
        const tokenMetadataFromArweave = await fetch(`${baseUri}/${token.metadata.reference}`)
          .then((res) => res.json())
          .catch((e) => console.error(e));
        setUrl(tokenMetadataFromArweave.media);
      }
      setIsLoading(false);
    })();
  }, []);

  return [url, isLoading];
};

const NftResolver = ({ token, collection }) => {
  const [nftMediaUrl, isLoading] = useResolveNftMedia(token, collection);

  return (
    <div className="bu-column bu-is-4 bu-is-half-tablet">
      {isLoading ? (
        <span className="spinner-grow spinner-grow-sm m-r-4" />
      ) : (
        <img src={nftMediaUrl} />
      )}
    </div>
  );
};

const NftWrapper = styled.div`
  background: white;
  font-size: 14px;
  padding: 0.75rem;

  .near-nft-token {
    -webkit-box-flex: 1;
    flex-grow: 1;
    flex-basis: 50%;
    max-width: 30%;
    padding: 15px 0px;
    color: black;
    padding-right: 4px;
  }
  .near-nft-token img {
    width: 100%;
    margin-bottom: 10px;
  }
`;

add(({ entityId }) => {
  const [nftData, isNftDataLoading] = useNearNFT(entityId);
  return (
    <NftWrapper>
      {isNftDataLoading ? (
        <div>
          Loading ...
          <span className="spinner-grow spinner-grow-sm m-r-4" />
        </div>
      ) : nftData ? (
        nftData.map((nftCollection) => (
          <div>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                marginBottom: '1.5rem',
                marginTop: '1.5rem',
              }}
            >
              <img width={32} src={nftCollection.metadata.icon} style={{ marginRight: '1rem' }} />
              <strong>{nftCollection.metadata.name}</strong>
            </div>
            <div class="bu-columns" style={{ flexFlow: 'wrap' }}>
              {nftCollection.tokens.map((i) => {
                return <NftResolver collection={nftCollection} token={i} />;
              })}
            </div>
          </div>
        ))
      ) : (
        <div style={{ fontSize: 14 }}>No NFTs</div>
      )}
    </NftWrapper>
  );
});
