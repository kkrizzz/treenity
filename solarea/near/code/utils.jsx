const { useQuery, Buffer } = solarea;
const { useConnection } = solarea.nearContext;

const NEAR_RPC = {
  mainnet: 'https://rpc.mainnet.near.org',
  testnet: 'https://rpc.testnet.near.org',
  betanet: 'https://rpc.betanet.near.org',
};

const tokensDecimalsPow = (amount, decimals, toFixed = 4) =>
  (amount * Math.pow(10, -decimals)).toFixed(toFixed);

const nearFetch = async (rpc, params, queryMethod = 'query', httpMethod = 'POST', body = {}) => {
  body.jsonrpc = '2.0';
  body.id = 'test';
  body.method = queryMethod;
  body.params = params;

  return (
    await fetch(NEAR_RPC[rpc], {
      method: httpMethod,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => res.json())
  ).result;
};

const parseNearBuffer = (buffer) => {
  return JSON.parse(Buffer.from(buffer).toString('utf-8'));
};

exports.useAccount = (entityId) => {
  const { config } = useConnection();
  const { data, isLoading } = useQuery([entityId, 'acc'], () =>
    nearFetch(config.networkId, {
      request_type: 'view_account',
      finality: 'final',
      account_id: entityId,
    }),
  );
  return [data, isLoading];
};

exports.useNearAccTransactions = (entityId, limit, offset) => {
  const { data, isLoading } = useQuery([entityId, 'transactions'], () =>
    window
      .fetch('/near/api/acctx', {
        method: 'POST',
        body: JSON.stringify({ entityId, limit, offset }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json()),
  );

  return [data, isLoading];
};

exports.humanizeFormatter = function (num, digits) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'm' },
    { value: 1e9, symbol: 'b' },
    { value: 1e12, symbol: 't' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
};

exports.useNearCoinData = () => {
  const { data, isLoading } = useQuery(['coingecko', 'near'], () =>
    window.fetch('https://api.coingecko.com/api/v3/coins/near').then((res) => res.json()),
  );
  return [data, isLoading];
};

exports.useNearStats = () => {
  const { data, isLoading } = useQuery(['near_tx_stats'], () =>
    window.fetch('/near/api/todaystats').then((res) => res.json()),
  );

  return [data, isLoading];
};

exports.useNearTx = (entityId) => {
  const { data, isLoading } = useQuery(['tx', entityId], () =>
    window.fetch(`/near/api/tx/${entityId}`).then((res) => res.json()),
  );

  return [data, isLoading];
};

exports.useNearBlockFromIndexer = (entityId) => {
  const { data, isLoading } = useQuery(['block', 'indexer', entityId], () =>
    window.fetch(`/near/api/block/${entityId}`).then((res) => res.json()),
  );
  return [data, isLoading];
};

exports.useNearBlockFromRPC = (entityId) => {
  const { config } = useConnection();

  const { data, isLoading } = useQuery(
    ['block', 'rpc_block_info', entityId],
    () =>
      nearFetch(
        config.networkId,
        { block_id: !isNaN(Number(entityId)) ? Number(entityId) : entityId },
        'block',
      ), // check if hash
  );
  return [data, isLoading];
};

exports.useNearTwoWeeksStats = () => {
  const { data, isLoading } = useQuery(['near_tx_stats_2week'], () =>
    window.fetch('/near/api/2weekstats').then((res) => res.json()),
  );

  return [data, isLoading];
};

exports.useNearNodeStatus = () => {
  const { config } = useConnection();

  const { data, isLoading } = useQuery([config, 'node-status'], () =>
    nearFetch(config.networkId, [], 'status'),
  );

  return [data, isLoading];
};

exports.useNearNetworkInfo = () => {
  const { config } = useConnection();

  const { data, isLoading } = useQuery([config, 'network_info'], () =>
    nearFetch(config.networkId, [], 'network_info'),
  );

  return [data, isLoading];
};

exports.useNearTokens = (entityId) => {
  const { config } = useConnection();
  const [target, setTarget] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  const { data: tokensLikely, isLoading: isTokensLikelyLoading } = useQuery(
    [entityId, 'likelyTokens'],
    () =>
      window
        .fetch(`${config.helperUrl}/account/${entityId}/likelyTokens`)
        .then((res) => res.json()),
  );

  React.useEffect(() => {
    (async function () {
      if (!isTokensLikelyLoading && tokensLikely.length) {
        setTarget(undefined);
        setIsLoading(true);
        const TOKENS = (
          await Promise.all(
            tokensLikely.map(async (i) => {
              const metadataReq = await nearFetch(config.networkId, [`call/${i}/ft_metadata`, '']);
              if (!metadataReq || !metadataReq.result) return null;
              const metadata = parseNearBuffer(metadataReq.result);

              const tokensReq = await nearFetch(config.networkId, [
                `call/${i}/ft_balance_of`,
                solarea.borsh.baseEncode(JSON.stringify({ account_id: entityId })),
              ]);

              const tokens = parseNearBuffer(tokensReq.result);

              return new Promise((resolve) => resolve({ metadata, tokens, contract: i }));
            }),
          )
        ).filter((i) => i !== null);

        setTarget(TOKENS);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    })();
  }, [tokensLikely, isTokensLikelyLoading, entityId]);

  return [target, isLoading];
};

exports.useNearNFT = (entityId) => {
  const { config } = useConnection();
  const [target, setTarget] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  const { data: nftLikely, isLoading: isNftLikelyLoading } = useQuery([entityId, 'nft'], () =>
    window.fetch(`${config.helperUrl}/account/${entityId}/likelyNFTs`).then((res) => res.json()),
  );

  React.useEffect(() => {
    (async function () {
      if (!isNftLikelyLoading && nftLikely.length) {
        setTarget(undefined);
        setIsLoading(true);
        const NFT_TOKENS = await Promise.all(
          nftLikely.map(async (i) => {
            const metadataReq = await nearFetch(config.networkId, [`call/${i}/nft_metadata`, '']);
            const metadata = parseNearBuffer(metadataReq.result);

            const tokensReq = await nearFetch(config.networkId, [
              `call/${i}/nft_tokens_for_owner`,
              solarea.borsh.baseEncode(
                JSON.stringify({ account_id: entityId, from_index: '0', limit: 8 }),
              ),
            ]);

            const tokens = parseNearBuffer(tokensReq.result);

            return new Promise((resolve) => resolve({ metadata, tokens, contract: i }));
          }),
        );

        setTarget(NFT_TOKENS);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    })();
  }, [nftLikely, isNftLikelyLoading, entityId]);

  return [target, isLoading];
};

exports.nearHumanBalance = (balance) => {
  return (balance * 0.000000000000000000000001).toFixed(5) + ' Ⓝ';
};
