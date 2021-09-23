exports.useBitQuery = (query, variables) => {
  const { data, isLoading } = solarea.useQuery([query, variables], () =>
    fetch('https://graphql.bitquery.io/', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json()),
  );

  if (isLoading) return [undefined, true];

  const ethereum = data.data.ethereum;
  const tokenData = isLoading
    ? undefined
    : {
        ...ethereum.address[0].smartContract.currency,
        ...ethereum.dexTrades[0],
      };

  return [tokenData, false];
};
