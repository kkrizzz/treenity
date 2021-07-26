await require('https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.2/css/bulma.min.css');

const { bs58 } = solarea;

const search = (id) => {
  let exName;

  if (id.length >= 64 && bs58.decodeUnsafe(id)?.length === 64) {
    exName = 'tx';
  } else if (id.length >= 32 && bs58.decode(id)?.length === 32) {
    exName = 'address';
  } else if (!Number.isNaN(parseInt(id))) exName = 'block';

  if (exName) window.history.pushState({}, '', `/${exName}/${id}`);
};

add(({ children }) => {
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
  `,
  );

  const input = React.useRef();

  return (
    <div>
      <Render id="explorer" name="layout-menu" />
      <div class="container is-max-desktop explorer-layout m-b-16 m-t-16">
        <input
          ref={input}
          id="exp-l-id"
          class="input is-primary explorer-layout-input"
          placeholder="Search for accounts, transactions, blocks..."
        />
        <div onClick={() => search(input.current.value)} class="button explorer-layout-button">
          <Render id="icons" name="search" />
        </div>
      </div>
      {children}
    </div>
  );
});
