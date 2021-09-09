const { useQuery, Buffer } = solarea;

const NEAR_RPC = {
  mainnet: 'https://rpc.mainnet.near.org',
  testnet: 'https://rpc.testnet.near.org',
  betanet: 'https://rpc.betanet.near.org',
};

const newNearFetch = (url, method) => async (params, body = {}) => {
  body.jsonrpc = '2.0';
  body.id = 'test';
  body.method = 'query';
  body.params = params;

  return (
    await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => res.json())
  ).result;
};

const nearFetch = newNearFetch(NEAR_RPC.mainnet, 'POST');

const parseNearBuffer = (buffer) => {
  return JSON.parse(Buffer.from(buffer).toString('utf-8'));
};

exports.useAccount = (entityId) => {
  const { data, isLoading } = useQuery([entityId, 'acc'], () =>
    nearFetch({
      request_type: 'view_account',
      finality: 'final',
      account_id: entityId,
    }),
  );
  return [data, isLoading];
};

exports.useNearAccTransactions = (entityId) => {
  const { data, isLoading } = useQuery([entityId, 'transactions'], () =>
    window
      .fetch('/solarea/near/acctx', {
        method: 'POST',
        body: JSON.stringify({ entityId }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json()),
  );

  return [data, isLoading];
};

exports.useNearNFT = (entityId) => {
  const [target, setTarget] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  const { data: nftLikely, isLoading: isNftLikelyLoading } = useQuery([entityId, 'nft'], () =>
    window
      .fetch(`https://helper.mainnet.near.org/account/${entityId}/likelyNFTs`)
      .then((res) => res.json()),
  );

  React.useEffect(() => {
    (async function () {
      if (!isNftLikelyLoading && nftLikely.length) {
        const NFT_TOKENS = await Promise.all(
          nftLikely.map(async (i) => {
            const metadataReq = await nearFetch([`call/${i}/nft_metadata`, '']);
            const metadata = parseNearBuffer(metadataReq.result);

            const tokensReq = await nearFetch([
              `call/${i}/nft_tokens_for_owner`,
              solarea.borsh.baseEncode(
                JSON.stringify({ account_id: entityId, from_index: '0', limit: 8 }),
              ),
            ]);

            const tokens = parseNearBuffer(tokensReq.result);

            return new Promise((resolve) => resolve({ metadata, tokens }));
          }),
        );

        setTarget(NFT_TOKENS);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    })();
  }, [nftLikely, isNftLikelyLoading]);

  return [target, isLoading];
};

exports.nearHumanBalance = (balance) => {
  return (balance * 0.000000000000000000000001).toFixed(5);
};
