const { BufferLayout, SolanaLayout, Buffer, useMetaplexNFT } = solarea;
const { PublicKey } = solanaWeb3;

const BulmaCard = render('dev', 'bulma-card');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');

const RandomImageWithNonce = render('dev', 'random-image-with-nonce');

const MintLayout = BufferLayout.struct([
  BufferLayout.u32('mintAuthorityOption'),
  SolanaLayout.publicKeyString('mintAuthority'),
  BufferLayout.nu64('supply'),
  BufferLayout.u8('decimals'),
  BufferLayout.u8('isInitialized'),
  BufferLayout.u32('freezeAuthorityOption'),
  SolanaLayout.publicKeyString('freezeAuthority'),
]);

const TwoColumn = render('dev', 'two-column');
const AccountName = render('', 'name', 'react-text', {
  fallback: ({ id }) => id,
});

add(({ account, entityId }) => {
  const decoded = MintLayout.decode(account.data);
  const [viewMore, setViewMore] = React.useState(false);

  const [tokensData, isTokenLoading] = solarea.useGraphQL(
    '/solana/tokens',
    `{
    allTokens(filter: { address: "${entityId}" }) {
      chainId 
      logoURI
      symbol
      name
      decimals
      tags
      extensions
    } 
   }`,
  );
  const tokensInfo = tokensData?.data.allTokens?.[0];

  const [nftTokenData, isNftDataLoading] = useMetaplexNFT(entityId);

  useCSS(
    'bulma-skip-last-child.css',
    css`
      .bu-columns:last-child {
        margin-bottom: 0.75rem;
      }
      .bu-columns:not(:last-child) {
        margin-bottom: 0.75rem;
      }
    `,
  );
  return (
    <BulmaCard>
      <div className="bu-media">
        <div className="bu-media-left">
          <figure className="bu-image bu-is-64x64">
            {tokensInfo && tokensInfo.logoURI ? (
              <img src={tokensInfo.logoURI} alt="Placeholder image" />
            ) : (
              <RandomImageWithNonce width={64} address={entityId} />
            )}
          </figure>
        </div>
        <div className="bu-media-content">
          <p className="bu-title bu-is-4">
            {nftTokenData?.name || tokensInfo?.name?.toString() || 'Unknown token'}
            {tokensInfo && <div className="m-l-8 bu-tag bu-is-light">{tokensInfo.symbol}</div>}
          </p>
          <p className="bu-subtitle bu-is-6">{nftTokenData ? 'NFT token' : 'Token'}</p>
        </div>
        <div className="bu-media-right">
          <div
            onClick={() => setViewMore(!viewMore)}
            style={{ cursor: 'pointer' }}
            className="bu-tag bu-is-link"
          >
            {viewMore ? 'Hide ↑' : 'More ↓'}
          </div>
        </div>
      </div>
      {nftTokenData && (
        <div className="bu-media bu-is-justify-content-center bu-is-align-items-center">
          <img src={nftTokenData.image} width={256} />
          <div
            className="bu-notification bu-tc-monospace log-messages"
            style={{
              flex: 0.6,
              background: 'var(--theme-logs-bg)',
              color: 'var(--theme-main-color)',
              margin: '-1rem',
              marginLeft: 16,
            }}
          >
            {nftTokenData.description}
          </div>
        </div>
      )}
      {!nftTokenData && !isNftDataLoading && (
        <div>
          <TwoColumn first="Supply" second={decoded.supply / Math.pow(10, decoded.decimals)} />
          <TwoColumn first="Decimals" second={decoded.decimals} />
        </div>
      )}
      {tokensInfo && tokensInfo.extensions?.website && (
        <TwoColumn
          first="Website"
          second={
            <a target="_blank" href={tokensInfo.extensions.website}>
              {tokensInfo.extensions.website}
            </a>
          }
        />
      )}
      {nftTokenData && (
        <div>
          <TwoColumn
            first="Creator"
            second={
              <NamedHash
                type="address"
                alignRight
                hash={nftTokenData.properties.creators[0].address}
              />
            }
          />
          <TwoColumn
            first="Marketplace"
            second={
              <a class="bu-tc-link" href={nftTokenData.external_url}>
                Metaplex
              </a>
            }
          />
          <TwoColumn
            first="Metadata"
            second={
              <a className="bu-tc-link" target="_blank" href={nftTokenData.metadataUrl}>
                <Render id="icons" name="arweave" />
              </a>
            }
          />
        </div>
      )}
      {viewMore && (
        <div>
          <TwoColumn
            first="Mint Authority"
            second={<Hash alignRight hash={decoded.mintAuthority} type="address" />}
          />
          <TwoColumn
            first="Freeze Authority"
            second={<Hash alignRight hash={decoded.freezeAuthority} type="address" />}
          />
        </div>
      )}
    </BulmaCard>
  );
});
