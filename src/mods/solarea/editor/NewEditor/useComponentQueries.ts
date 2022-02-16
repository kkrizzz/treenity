import { SolareaViewId } from '../../storage-adapters/SolareaViewId';
import { useQuery } from 'react-query';
import IComponentQuery from './types/IComponentQuery';
import camelize from './graphql-editor/utils/camelize';

const useComponentQueries = ({ id: componentID }: SolareaViewId) => {
  const url = `/solarea/graphql/components/queries?componentID=${componentID}`;
  const { data: componentQueries, isLoading, refetch } = useQuery(
    ['componentQueries', componentID],
    () => fetch(url).then((r) => r.json() as Promise<Array<IComponentQuery>>),
  );

  const save = (queries): Promise<Response> =>
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ queries, componentID }),
    });

  const add = ({ variables, endpoint_url, name, query }): Promise<Response> =>
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryData: { endpoint_url, variables, name: camelize(name), query },
        componentID,
      }),
    });

  return {
    componentQueries: componentQueries || [],
    isLoading,
    save,
    add,
    refetch,
  };
};

export default useComponentQueries;
