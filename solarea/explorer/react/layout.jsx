require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');

const { bs58 } = solarea;

const search = (id) => {
  let exName;
  let exType;

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
  const input = React.useRef();
  const setSearch = () => {
    onChange(input.current.value);
  };

  return (
    <>
      <input
        ref={input}
        id="exp-l-id"
        className="bu-input bu-is-primary explorer-layout-input"
        placeholder="Search for accounts, transactions, blocks..."
        onKeyPress={(evt) => evt.code === 'Enter' && setSearch()}
      />
      <div onClick={setSearch} className="bu-button explorer-layout-button">
        <Render id="icons" name="search" />
      </div>
    </>
  );
};

add(({ id, children }) => {
  useCSS(
    'explorer-layout.css',
    `
   .explorer-layout {
      flex-flow: nowrap;
      display: flex;
      justify-content: center;
      align-items: center;
   }
   .explorer-layout-input {
     box-sizing: border-box;
     flex: 0.95;
   }
   .explorer-layout-button {
    flex: 0.05;
    text-align: center;
    min-width: 48px;
    margin-left: 4px;
   }
   @media screen and (max-width: 1200px) {
    .p-8-mobile {
      padding: 8px;
    }
   }
   .bu-navbar-link:not(.bu-is-arrowless)::after {
    border-color: white !important;
   }
  `,
  );

  return (
    <div>
      <Render id="explorer" name="acc-css" />
      <Render id={id} name="layout-header" />
      <div class="bu-container bu-is-max-desktop explorer-layout p-8-mobile m-b-16 m-t-16">
        <Search onChange={search} />
      </div>
      {children}
    </div>
  );
});
