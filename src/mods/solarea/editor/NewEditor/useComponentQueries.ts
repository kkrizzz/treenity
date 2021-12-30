import { SolareaViewId } from '../../storage-adapters/SolareaViewId';
import { useQuery } from 'react-query';

interface IComponentQuery {
  _id: string;
  componentID: string;

  query: string;
  name: string;
}

const useComponentQueries = ({ id: componentID }: SolareaViewId) => {
  const url = `/solarea/graphql/components/queries?componentID=${componentID}`;
  const { data: componentQueries, isLoading } = useQuery(['componentQueries', componentID], () =>
    fetch(url).then((r) => r.json() as Promise<Array<IComponentQuery>>),
  );

  const save = (queries): Promise<Response> =>
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ queries, componentID }),
    });

  const add = ({ variables, endpoint_url, name }): Promise<Response> =>
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queries: [{ endpoint_url, variables, name: camelize(name) }],
        componentID,
      }),
    });

  return { componentQueries: componentQueries || [], isLoading, save, add };
};

function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export default useComponentQueries;
