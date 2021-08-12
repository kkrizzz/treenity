const { BufferLayout, SolanaLayout, Buffer } = solarea;
const { PublicKey } = solanaWeb3;

const BulmaCard = render('dev', 'bulma-card');
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

const urlRegExp = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
);

const metaplexProgramId = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

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

  const connection = solarea.useConnection();

  const [image, setImage] = React.useState('');

  React.useEffect(() => {
    (async function () {
      const associatedMetaDataAccount = (
        await PublicKey.findProgramAddress(
          [
            Buffer.from('metadata'),
            metaplexProgramId.toBuffer(),
            new PublicKey(entityId).toBuffer(),
          ],
          metaplexProgramId,
        )
      )[0];
      const { data } = await connection.getAccountInfo(associatedMetaDataAccount);
      const utf8 = data.toString('utf-8');
      const [metadataUrl] = urlRegExp.exec(utf8);
      const arweaveStoredMetadata = await (await fetch(metadataUrl)).json();
      console.log(arweaveStoredMetadata);
      setImage(arweaveStoredMetadata.image);
    })();
  });

  const tokensInfo = tokensData?.data.allTokens?.[0];

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
            {tokensInfo?.name?.toString() || 'Unknown token'}
            {tokensInfo && <div className="m-l-8 bu-tag bu-is-light">{tokensInfo.symbol}</div>}
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
      <div className="bu-media">
        <figure className="bu-image bu-is-256x256">
          <img src={image} alt="Placeholder image" />
        </figure>
      </div>
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
