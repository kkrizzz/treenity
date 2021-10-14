const {
  useAccount: useNearAccount,
  nearHumanBalance,
  useNearNFT,
  useNearAccTransactions,
  useNearTokens,
} = await require('solarea://near/utils');

const NftWrapper = styled.div`
  background: white;
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
        <div>Loading ...</div>
      ) : (
        nftData.map((nftCollection) => (
          <div>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                marginBottom: '1.5rem',
              }}
            >
              <img width={32} src={nftCollection.metadata.icon} style={{ marginRight: '1rem' }} />
              <strong>{nftCollection.metadata.name}</strong>
            </div>
            <div class="bu-columns">
              {nftCollection.tokens.map((i) => {
                return (
                  <div class="bu-column bu-is-4 bu-is-half-tablet">
                    <img
                      src={
                        i.metadata.media.startsWith('bafy')
                          ? `https://ipfs.fleek.co/ipfs/${i.metadata.media}`
                          : i.metadata.media
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </NftWrapper>
  );
});
