const { copyTextToClipboard } = await require('solarea://dev/copy');
const { toast, error } = await require('solarea://dev/toast');
const Link = render('dev', 'link');
const FeCopy = render('icons', 'fe-copy');

const Hash = ({ hash, type = 'address', children }) => {
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
      <div style={{ float: 'left', marginRight: 4, width: 16 }} onClick={copyHash}>
        <FeCopy />
      </div>
      <Link to={`/${type}/${hash}`} className="bu-monospace bu-tc-link" style={{ display: 'flex' }}>
        {children || fallback()}
      </Link>
    </div>
  );
};

add(Hash);
