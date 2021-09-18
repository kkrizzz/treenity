const { bs58 } = solarea;

const Link = render('dev', 'link');

const search = (id) => {
  let exName;

  if (id.includes('.near')) {
    exName = 'account';
  }

  if (exName) window.history.pushState({}, '', `/dashboard/portfolio?entityId=${id}`);
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
            placeholder="Search for near account portfolio ..."
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
        ></div>
      </div>
    </p>
  );
};

add(() => <Search onChange={search} />);
