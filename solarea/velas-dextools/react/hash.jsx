const { copyTextToClipboard } = await require('solarea://dev/copy');
const { toast, error } = await require('solarea://dev/toast');
const { numberWithSpaces } = await require('solarea://explorer/utils');
const Link = render('dev', 'link');
const FeCopy = render('icons', 'fe-copy');

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.33325 10H2.66659C2.31296 10 1.97382 9.85952 1.72378 9.60947C1.47373 9.35942 1.33325 9.02028 1.33325 8.66666V2.66666C1.33325 2.31304 1.47373 1.9739 1.72378 1.72385C1.97382 1.4738 2.31296 1.33333 2.66659 1.33333H8.66659C9.02021 1.33333 9.35935 1.4738 9.60939 1.72385C9.85944 1.9739 9.99992 2.31304 9.99992 2.66666V3.33333M7.33325 6H13.3333C14.0696 6 14.6666 6.59695 14.6666 7.33333V13.3333C14.6666 14.0697 14.0696 14.6667 13.3333 14.6667H7.33325C6.59687 14.6667 5.99992 14.0697 5.99992 13.3333V7.33333C5.99992 6.59695 6.59687 6 7.33325 6Z"
      stroke="#BABFC5"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const Hash = ({
  hash,
  type,
  children,
  customLink,
  urlParams,
  alignRight = false,
  suffixLen = 4,
  threshold = 15,
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
        color: var(--theme-main-content-color);
      }

      .hash-copy-icon svg {
        width: 14px;
        height: 14px;
        //margin: 6px;
        display: flex;
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
      className="hash-container"
      style={{ justifyContent: alignRight ? 'flex-end' : 'flex-start' }}
    >
      <div className="hash-copy-icon" onClick={copyHash}>
        <CopyIcon />
      </div>

      <div className="hash-copy-content">
        {type || customLink ? (
          <Link
            to={customLink ? customLink : `/${type}/${hash}${urlParams ? `?${urlParams}` : ''}`}
            className="bu-tc-link bu-monospace"
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
