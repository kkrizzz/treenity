const fetch = require('node-fetch');

const THE_GRAPH_HEADERS = {
  accept: 'application/json',
  'accept-language': 'en-US,en;q=0.9,en-US;q=0.8,en;q=0.7',
  'cache-control': 'no-cache',
  'content-type': 'application/json',
  pragma: 'no-cache',
  referer: 'https://thegraph.wagyuswap.app/subgraphs/name/wagyu/graphql',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

export async function fetchVelasTheGraph(query: string, variables?: any) {
  const req = await fetch('https://thegraph.wagyuswap.app/subgraphs/name/wagyu', {
    method: 'POST',
    cache: 'no-cache',
    headers: THE_GRAPH_HEADERS,
    body: JSON.stringify({ query, variables }),
  });
  if (req.status !== 200) {
    throw new Error(`TheGraph: fetch error ${req.status}, ${req.statusText}`);
  }
  const result = await req.json();
  if (result.errors) {
    throw new Error(result.errors.map((e) => e.message).join('; '));
  }

  return result.data;
}
