import * as React from 'react';
import { useQuery } from 'react-query';

export function fetchGraphQL(url: string, query: string, variables: any = {}, options: any = {}) {
  return fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify({ query, variables }),
  }).then((res) => res.json());
}

export function useGraphQL(url: string, code: string, headers) {
  const { data, isLoading } = useQuery(code, () => fetchGraphQL(url, code, {}, headers));

  return [data, isLoading];
}
