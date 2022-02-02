import { useQuery } from 'react-query';
interface Query {
  _id: string;
  url: string;
  name: string;
  description: string;
}

export function useEndpointQueries(
  endpointID?: string,
): { queries: Array<Query>; isQueriesLoading: boolean } {
  const { data, isLoading } = useQuery(
    ['graphql-queries', endpointID],
    () =>
      fetch(`/solarea/graphql/queries?endpoint=${endpointID}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }).then((r) => r.json()),
    { enabled: !!endpointID },
  );

  return { queries: data || [], isQueriesLoading: isLoading };
}
