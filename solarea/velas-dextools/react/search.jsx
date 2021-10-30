const { bs58 } = solarea;

const Link = render('dev', 'link');

function buildOptions(string, poolList) {
  if (string.length === 0) return [];

  string = string.toLowerCase();

  const options = [];

  poolList.forEach((i) => {
    const baseSymbol = i.base.symbol;
    const quoteSymbol = i.quote.symbol;

    if (baseSymbol.toLowerCase().includes(string)) {
      options.push({
        label: `${baseSymbol}/${quoteSymbol}`,
        pathname: `/${i.base.address}?quote=${i.quote.address}`,
      });
    }
  });

  if (options.length > 0) return options;

  return options;
}

const search = (id) => {
  if (!id) return;
  let isToken;

  if (id.startsWith('0x')) {
    isToken = 'account';
  }

  if (isToken) window.history.pushState({}, '', `/${id.toLowerCase()}`);
};

const Search = ({ onChange }) => {
  const { data: poolList, isLoading: isPoolListLoading } = solarea.useQuery(
    ['pool-list', 'velas-mainnet'],
    () => fetch('/api/velas/poollist').then((res) => res.json()),
  );

  const [value, setValue] = React.useState('');

  const results = poolList ? buildOptions(value, poolList) : [];

  const onSetValue = (evt) => {
    setValue(evt.target.value);
  };

  const doSearch = () => {
    setValue('');
    onChange(value);
  };

  useCSS(
    'explorer-search.css',
    css`
      .explorer-layout-input .bu-input {
        background: var(--theme-card-bg-color) !important;
        color: var(--theme-main-color) !important;
      }
      .explorer-layout-input .bu-input::placeholder {
        color: var(--theme-main-color) !important;
        opacity: 40%;
      }
      .explorer-layout-input .bu-input:focus ~ .bu-icon {
        color: inherit !important;
      }

      .explorer-layout-input {
        flex: 1;
        box-sizing: border-box;
      }
      .remove-border {
        border-radius: 6px !important;
        box-shadow: var(--theme-card-shadow);
        border: none;
        outline: none;
      }
      .remove-border:active {
        box-shadow: var(--theme-card-shadow);
        border: none;
        outline: none;
      }
      .remove-border:focus {
        box-shadow: var(--theme-card-shadow);
        border: none;
        outline: none;
      }
    `,
  );

  return (
    <p className="bu-control bu-has-icons-right explorer-layout-input">
      <div class={`bu-dropdown ${results.length ? 'bu-is-active' : ''}`} style={{ width: '100%' }}>
        <div style={{ flex: 1 }}>
          <input
            id="exp-l-id"
            className="bu-input bu-is-rounded remove-border"
            placeholder="Search for tokens by name or address ..."
            aria-haspopup="true"
            aria-controls="search-dropdown"
            value={value}
            style={{ paddingLeft: 40 }}
            onChange={onSetValue}
            onKeyPress={(evt) => evt.code === 'Enter' && doSearch()}
          />
          <span class="bu-icon bu-is-left" style={{ top: 2, left: 2 }}>
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
              <div className="bu-dropdown-item">
                <Link to={r.pathname} onClick={() => setValue('')}>
                  {r.label}
                  <br />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </p>
  );
};

add(() => <Search onChange={search} />);
