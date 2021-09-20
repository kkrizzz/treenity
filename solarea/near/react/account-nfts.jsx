add(({ nftData }) => {
  useCSS(
    'near-nft-tokens.css',
    css`
      .near-nft-token {
        -webkit-box-flex: 1;
        flex-grow: 1;
        flex-basis: 50%;
        max-width: 50%;
        padding: 15px 0px;
        color: black;
        padding-right: 4px;
      }
      .near-nft-token img {
        width: 100%;
        margin-bottom: 10px;
      }
    `,
  );
  return nftData ? (
    nftData.map((nftCollection) => {
      return (
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
          <div style={{ display: 'flex', flexFlow: 'wrap', maxWidth: '100%' }}>
            {nftCollection.tokens.map((i) => {
              return (
                <div className="near-nft-token">
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
      );
    })
  ) : (
    <div>No nft</div>
  );
});
