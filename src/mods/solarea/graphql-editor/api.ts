export const fetcher = (graphQLParams, query) => {
  return fetch(`/solarea/graphql?url=${encodeURI(query.endpoint_url)}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graphQLParams),
    credentials: 'same-origin',
  });
};
