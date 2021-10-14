const { bs58 } = solarea;

const Link = render('dev', 'link');

const search = (id) => {
  let exName;

  if (id.includes('.near')) {
    exName = 'account';
  } else if (Number(id)) {
    exName = 'block';
  } else {
    exName = 'transaction';
  }

  console.log(Number(id));

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

  useCSS(
    'explorer-search.css',
    css`
      .explorer-layout-input {
        flex: 1;
        box-sizing: border-box;
      }
      .remove-border {
        border-radius: 16px !important;
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
      <div class={`bu-dropdown`} style={{ width: '100%' }}>
        <div style={{ flex: 1 }}>
          <input
            id="exp-l-id"
            className="bu-input bu-is-rounded remove-border"
            placeholder="Search for accounts, transactions, blocks..."
            aria-haspopup="true"
            aria-controls="search-dropdown"
            value={value}
            onChange={onSetValue}
            onKeyPress={(evt) => evt.code === 'Enter' && doSearch()}
          />
          <span
            class="bu-icon bu-is-right"
            style={{ top: 2, right: 4, cursor: 'pointer', pointerEvents: 'all' }}
          >
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
        ></div>
      </div>
    </p>
  );
};

add(() => <Search onChange={search} />);
