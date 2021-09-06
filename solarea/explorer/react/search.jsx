const { bs58 } = solarea;

const Link = render('dev', 'link');

function buildOptions(
  rawSearch,
  // cluster: Cluster,
  // tokenRegistry: TokenInfoMap
) {
  const search = rawSearch.trim();
  if (search.length === 0) return [];

  const options = [];

  // const programOptions = buildProgramOptions(search, cluster);
  // if (programOptions) {
  //   options.push(programOptions);
  // }
  //
  // const loaderOptions = buildLoaderOptions(search);
  // if (loaderOptions) {
  //   options.push(loaderOptions);
  // }
  //
  // const sysvarOptions = buildSysvarOptions(search);
  // if (sysvarOptions) {
  //   options.push(sysvarOptions);
  // }
  //
  // const specialOptions = buildSpecialOptions(search);
  // if (specialOptions) {
  //   options.push(specialOptions);
  // }
  //
  // const tokenOptions = buildTokenOptions(search, cluster, tokenRegistry);
  // if (tokenOptions) {
  //   options.push(tokenOptions);
  // }

  if (!isNaN(Number(search)) && !search.startsWith('0x')) {
    options.push({
      label: 'Block',
      options: [
        {
          label: `Slot #${search}`,
          value: [search],
          pathname: `/block/${search}`,
        },
      ],
    });
  }

  // Prefer nice suggestions over raw suggestions
  if (options.length > 0) return options;

  try {
    const decoded = bs58.decode(search);
    if (decoded.length === 32) {
      options.push({
        label: 'Account',
        options: [
          {
            label: search,
            value: [search],
            pathname: '/address/' + search,
          },
        ],
      });
    } else if (decoded.length === 64) {
      options.push({
        label: 'Transaction',
        options: [
          {
            label: search,
            value: [search],
            pathname: '/tx/' + search,
          },
        ],
      });
    }
  } catch (err) {}

  if (search.startsWith('0x')) {
    if (search.length === 42) {
      options.push({
        label: 'EVM Address',
        options: [
          {
            label: search,
            value: [search],
            pathname: '/address/' + search,
          },
        ],
      });
    } else if (search.length === 66) {
      options.push({
        label: 'EVM Transaction',
        options: [
          {
            label: search,
            value: [search],
            pathname: '/tx/' + search + '?chain=evm',
          },
        ],
      });
    }
  }

  return options;
}

const search = (id) => {
  let exName;

  const has0x = id.startsWith('0x');
  const isEthAddress = id.length === 42 && has0x;
  const isEthTx = id.length === 66 && has0x;

  if ((id.length >= 64 && bs58.decodeUnsafe(id)?.length === 64) || isEthTx) {
    exName = 'tx';
  } else if (
    (id.length >= 32 && (bs58.decodeUnsafe(id)?.length === 32 || id.length === 43)) ||
    isEthAddress
  ) {
    exName = 'address';
  } else if (!Number.isNaN(parseInt(id, 10))) {
    exName = 'block';
  }

  if (exName) window.history.pushState({}, '', `/${exName}/${id}`);
};

const Search = ({ onChange }) => {
  const [value, setValue] = React.useState('');
  const onSetValue = (evt) => {
    setValue(evt.target.value);
  };

  const doSearch = () => {
    setValue('');
    onChange(value);
  };

  const results = buildOptions(value);

  useCSS(
    'explorer-search.css',
    css`
      .explorer-layout-input {
        flex: 1;
        box-sizing: border-box;
      }
    `,
  );

  return (
    <p className="bu-control bu-has-icons-right explorer-layout-input">
      <div class={`bu-dropdown ${results.length ? 'bu-is-active' : ''}`} style={{ width: '100%' }}>
        <div style={{ flex: 1 }}>
          <input
            id="exp-l-id"
            className="bu-input bu-is-primary"
            placeholder="Search for accounts, transactions, blocks..."
            aria-haspopup="true"
            aria-controls="search-dropdown"
            value={value}
            onChange={onSetValue}
            onKeyPress={(evt) => evt.code === 'Enter' && doSearch()}
          />
          <span class="bu-icon bu-is-right">
            <div onClick={doSearch}>
              <Render id="icons" name="search" />
            </div>
          </span>
        </div>
        <div
          className="bu-dropdown-menu"
          id="search-dropdown"
          style={{ width: '100%' }}
          role="menu"
        >
          <div className="bu-dropdown-content">
            {results.map((r) => (
              <div class="bu-dropdown-item">
                <p>{r.label}</p>
                {r.options.map((o) => (
                  <Link to={o.pathname} onClick={() => setValue('')}>
                    {o.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </p>
  );
};

add(() => <Search onChange={search} />);
