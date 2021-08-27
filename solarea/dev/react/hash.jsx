const { copyTextToClipboard } = await require('solarea://dev/copy');
const { toast, error } = await require('solarea://dev/toast');
const Link = render('dev', 'link');
const FeCopy = render('icons', 'fe-copy');

const Hash = ({ hash, type = 'address', children, urlParams }) => {
  const start = hash.slice(0, -4);
  const end = hash.slice(-4);

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
    <div>
      <div
        style={{ float: 'left', marginRight: 4, width: 16, cursor: 'pointer' }}
        onClick={copyHash}
      >
        <FeCopy />
      </div>
      <Link
        to={`/${type}/${hash}${urlParams ? `?${urlParams}` : ''}`}
        className="bu-monospace bu-tc-link"
        style={{ display: 'flex', fontSize: 16.5 }}
      >
        {children || fallback()}
      </Link>
    </div>
  );
};

add(Hash);
