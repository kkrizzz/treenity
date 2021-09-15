const BulmaCard = render('dev', 'bulma-card');
const Table = render('dev', 'table');
const NamedHash = render('dev', 'named-hash');
const ScrollBox = render('dev', 'scroll-box');

const { tokenRegExp, numberWithSpaces } = await require('solarea://explorer/utils');
const columns = [
  { title: 'Token', dataIndex: 'tokenName' },
  {
    title: 'Address',
    dataIndex: 'tokenAddress',
    render: (tokenAddress) => (
      <NamedHash hash={tokenAddress} urlParams={'chain=evm'} type="address" />
    ),
  },
  {
    title: 'Supply',
    dataIndex: 'tokenSupply',
    textAlign: 'right',
    render: (tokenSupply) => numberWithSpaces(parseFloat(tokenSupply).toFixed(3)),
  },
  { title: 'Holders', dataIndex: 'holdersCount', textAlign: 'right' },
];

add(() => {
  const connection = solarea.useConnection();

  const isMainnet = connection._rpcEndpoint === 'https://mainnet.velas.com/rpc';
  const tokensUrl = isMainnet
    ? 'https://evmexplorer.velas.com/tokens?type=JSON'
    : 'https://evmexplorer.testnet.velas.com/tokens?type=JSON';
  const { data: tokenRawData, isLoading } = solarea.useQuery([isMainnet, 'tokendata_query'], () =>
    globalThis.fetch(tokensUrl).then((res) => res.json()),
  );

  const tokenData =
    !isLoading &&
    tokenRawData.items.map((tokenHtml) => {
      const [, tokenName, tokenAddress, tokenSupply, holdersCount] = tokenRegExp.exec(tokenHtml);
      return { tokenName, tokenAddress, tokenSupply, holdersCount };
    });

  return (
    <Render id="explorer" name="layout">
      <div className="bu-container bu-is-max-desktop">
        {isLoading ? (
          <BulmaCard header="Loading token data . . ." />
        ) : (
          <div>
            <BulmaCard header="Tokens" />
            <BulmaCard>
              <ScrollBox>
                <Table stripped columns={columns} data={tokenData} />
              </ScrollBox>
            </BulmaCard>
          </div>
        )}
      </div>
    </Render>
  );
});
