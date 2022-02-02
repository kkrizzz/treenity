import { useQuery } from 'react-query';
export interface Endpoint {
  _id: string;
  url: string;
  name: string;
  description: string;
}

export function useEndpoints(): { endpoints: Array<Endpoint>; isEndpointsLoading: boolean } {
  const { data, isLoading } = useQuery('graphql-endpoints', () =>
    fetch('/solarea/graphql/endpoints', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }).then((r) => r.json()),
  );

  return { endpoints: data, isEndpointsLoading: isLoading };
}
