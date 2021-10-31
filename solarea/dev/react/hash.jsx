const { copyTextToClipboard } = await require('solarea://dev/copy');
const { toast, error } = await require('solarea://dev/toast');
const { numberWithSpaces } = await require('solarea://explorer/utils');
const Link = render('dev', 'link');
const FeCopy = render('icons', 'fe-copy');

const CopyIcon = () => {
  useCSS(
    'copy-icon-hash.css',
    css`
      .copy-icon {
        background: var(--theme-main-bg-color);
        border-radius: 50%;
        color: var(--theme-main-content-color);
      }

      .copy-icon svg {
        width: 8px;
        height: 8px;
        margin: 6px;
        display: flex;
      }
    `,
  );

  return (
    <div className="copy-icon">
      <FeCopy />
    </div>
  );
};

const Hash = ({
  hash,
  type,
  children,
  customLink,
  urlParams,
  alignRight = false,
  suffixLen = 4,
  threshold = 15,
  target,
  icon,
  className,
}) => {
  useCSS(
    'hash.css',
    css`
      .hash-container {
        display: flex;
        align-items: center;
      }

      .hash-copy-icon {
        float: left;
        margin-right: 4px;
        width: 1em;
        height: 1em;
        min-width: 20px;
        min-height: 20px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .hash-copy-content {
        max-width: calc(100% - 24px);
      }
      .hash-copy-content > * {
        display: flex;
      }
    `,
  );
  const parsedHash = numberWithSpaces(hash);

  const fallback = (str = parsedHash) => {
    if (str?.length >= threshold) {
      const start = suffixLen ? str.slice(0, -suffixLen) : str;
      const end = suffixLen ? str.slice(-suffixLen) : '';

      return (
        <>
          <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {start}
          </div>
          {end}
        </>
      );
    }
    return str;
  };

  const copyHash = () => {
    copyTextToClipboard(hash).then(
      () => toast(`Copied ${hash}`),
      () => error('Cant copy'),
    );
  };

  return (
    <div
      className={`hash-container ${className}`}
      style={{ justifyContent: alignRight ? 'flex-end' : 'flex-start' }}
    >
      <div className="hash-copy-icon" onClick={copyHash}>
        {icon || <CopyIcon />}
      </div>

      <div className="hash-copy-content">
        {type || customLink ? (
          <Link
            to={customLink ? customLink : `/${type}/${hash}${urlParams ? `?${urlParams}` : ''}`}
            className="bu-tc-link bu-monospace"
            target={target}
          >
            {!!children
              ? typeof children === 'string'
                ? fallback(children)
                : children
              : fallback()}
          </Link>
        ) : (
          <div className="bu-monospace">{children || fallback()}</div>
        )}
      </div>
    </>
  );
};

add(Hash);
