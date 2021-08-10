const { BufferLayout, SolanaLayout } = solarea;

const BulmaCard = render('dev', 'bulma-card');

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

  return (
    <BulmaCard>
      {tokensInfo && (
        <div className="bu-media">
          <div className="bu-media-left">
            <figure className="bu-image bu-is-48x48">
              <img src={tokensInfo.logoURI} alt="Placeholder image" />
            </figure>
          </div>
          <div className="bu-media-content">
            <p className="bu-title bu-is-4">
              {tokensInfo.name.toString()}
              <div className="m-l-8 bu-tag bu-is-light">{tokensInfo.symbol}</div>
            </p>
            <p className="bu-subtitle bu-is-6">Token</p>
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
      )}
      <TwoColumn first="Supply" second={decoded.supply / Math.pow(10, decoded.decimals)} />
      <TwoColumn first="Decimals" second={decoded.decimals} />
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
      {viewMore && (
        <div>
          <TwoColumn
            first="Mint Authority"
            link={`/address/${decoded.mintAuthority}`}
            second={<AccountName id={decoded.mintAuthority} />}
          />
          <TwoColumn
            first="Freeze Authority"
            second={<AccountName id={decoded.freezeAuthority} />}
          />
        </div>
      )}
    </BulmaCard>
  );
});
