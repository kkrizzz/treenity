const { copyTextToClipboard } = await require('solarea://dev/copy');
const { toast, error } = await require('solarea://dev/toast');
const { numberWithSpaces } = await require('solarea://explorer/utils');
const Link = render('dev', 'link');
const FeCopy = render('icons', 'fe-copy');

const Hash = ({ hash, type, children, urlParams, alignRight = false }) => {
  const parsedHash = numberWithSpaces(hash);

  const start = parsedHash.slice(0, -4);
  const end = parsedHash.slice(-4);

  const fallback = () => (
    <>
      <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        {start}
      </div>
      {end}
    </>
  );

  const copyHash = () => {
    copyTextToClipboard(hash).then(
      () => toast('Copied'),
      () => error('Cant copy'),
    );
  };

  return (
    <div style={alignRight ? { display: 'flex', justifyContent: 'flex-end' } : {}}>
      <div
        style={{ float: 'left', marginRight: 4, width: 12, cursor: 'pointer' }}
        onClick={copyHash}
      >
        <FeCopy />
      </div>
      {type ? (
        <Link
          to={`/${type}/${hash}${urlParams ? `?${urlParams}` : ''}`}
          className="bu-tc-link"
          style={{ display: 'flex', fontFamily: 'monospace' }}
        >
          {children || fallback()}
        </Link>
      ) : (
        <div style={{ display: 'flex', fontFamily: 'monospace' }}>{children || fallback()}</div>
      )}
    </>
  );
};

add(Hash);
