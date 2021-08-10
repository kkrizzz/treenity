import * as React from 'react';
import { useQuery } from 'react-query';

export function useGraphQL(url: string, code: string, headers) {
  const { data, isLoading } = useQuery(code, () =>
    fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({ query: code, variables: {} }),
    }).then((res) => res.json()),
  );

  return [data, isLoading];
}
