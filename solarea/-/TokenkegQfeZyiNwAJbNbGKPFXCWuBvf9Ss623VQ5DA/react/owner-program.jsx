const { BufferLayout, SolanaLayout, Buffer, useMetaplexNFT } = solarea;
const { PublicKey } = solanaWeb3;

const DashboardCard = render('dev', 'dashboard-card');
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
    <DashboardCard gradient color={{ background: 'white' }}>
      <div className="bu-columns">
        <div className="bu-column bu-is-8">
          {nftTokenData && (
            <div className="bu-media bu-is-justify-content-start bu-is-align-items-start">
              <img src={nftTokenData.image} width={256} />
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
                <div style={{ margin: '44px 0' }}>
                  <p style={{ fontSize: 14, fontWight: 600 }}>
                    {nftTokenData ? 'NFT token' : 'Token'}
                  </p>
                  <p style={{ fontSize: 20, fontWight: 600 }}>
                    {nftTokenData?.name || tokensInfo?.name?.toString() || 'Unknown token'}
                    {tokensInfo && (
                      <div className="m-l-8 bu-tag bu-is-light">{tokensInfo.symbol}</div>
                    )}
                  </p>
                </div>
                <DashboardCard subcard>
                  <span style={{ fontSize: 14 }}>{nftTokenData.description}</span>
                </DashboardCard>
              </div>
            </div>
          )}
        </div>

        {nftTokenData && (
          <div className="bu-column bu-is-4">
            <DashboardCard size="small" title="Creator" subcard>
              <NamedHash
                type="address"
                alignRight
                hash={nftTokenData.properties.creators[0].address}
              />
            </DashboardCard>
            <DashboardCard size="small" title="Marketplace" subcard>
              <a className="bu-tc-link" target="_blank" href={nftTokenData.external_url}>
                Metaplex
              </a>
            </DashboardCard>
            <DashboardCard size="small" title="Metadata" subcard>
              <a className="bu-tc-link" target="_blank" href={nftTokenData.metadataUrl}>
                <Render id="icons" name="arweave" />
              </a>
            </DashboardCard>
          </div>
        )}
      </div>
    </DashboardCard>
  );
});
