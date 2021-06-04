import * as React from 'react';
import { BITQUERY_BASE } from '../config';

export function useBitQuery(code: string) {
  const [res, setRes] = React.useState<{ data: any }>({ data: '' });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setIsLoading(true);

    (async function () {
      const req = await fetch(BITQUERY_BASE, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'X-API-KEY': 'BQYuBhWWLDMGNQ7JbDU9BjOoYycCixU9',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: code, variables: {} }),
      });
      setRes(await req.json());
      setIsLoading(false);
    })();
  }, [code]);

  return [res, isLoading];
}
