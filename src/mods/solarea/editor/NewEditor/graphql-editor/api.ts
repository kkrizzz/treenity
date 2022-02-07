import camelize from './utils/camelize';
import IComponentQuery from '../types/IComponentQuery';

export const fetcher = (graphQLParams, query) => {
  return fetch(`/solarea/graphql/proxy?url=${encodeURI(query.endpoint_url)}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graphQLParams),
    credentials: 'same-origin',
  });
};

export const deleteQueryFromComponent = (queryID: string): Promise<Response> =>
  fetch(`/solarea/graphql/components/queries/${queryID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const addQueryToComponent = (
  componentID: string,
  { variables, endpoint_url, name, query }: Omit<IComponentQuery, '_id' | 'componentID'>,
): Promise<Response> =>
  fetch(`/solarea/graphql/components/queries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      queryData: { endpoint_url, variables, name: camelize(name), query },
      componentID,
    }),
  });

export const editQueryFromComponent = (
  queryID: string,
  update: Partial<IComponentQuery>,
): Promise<Response> =>
  fetch(`/solarea/graphql/components/queries/${queryID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  });
