import create from 'zustand';
import { buildClientSchema, getIntrospectionQuery } from 'graphql';
import { fetcher } from '../api';
import { flattenData } from '../components/flattenData';
import { getValueFrom } from '../utils/common';

export const useQueryStore = create<any>((set, get) => ({
  isSchemaLoading: false,
  isSchemaError: false,
  isQueryLoading: false,
  isQueryError: false,
  queries: [
    {
      query: '',
      variables: '{}',
      data_type: 'response',
      config: {},
      endpoint_url: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
      name: 'startWars',
    },
    {
      query: '',
      variables: '{}',
      data_type: 'response',
      config: {},
      endpoint_url: 'https://thegraph.wagyuswap.app/subgraphs/name/wagyu',
      name: 'wagy',
    },
  ],
  currentQueryName: null,
  setCurrentQuery(name) {
    set(() => ({ currentQueryName: name, schema: null }));
  },

  getCurrentQuery() {
    const { queries, currentQueryName }: any = get();

    console.log(currentQueryName);
    if (!currentQueryName) return null;

    return queries.find((q) => q.name === currentQueryName);
  },

  updateQuery: (params) =>
    set(({ queries, currentQueryName }) => {
      const index = queries.findIndex((q) => q.name === currentQueryName);
      if (index === -1) return;

      const newQueries = [...queries];
      newQueries[index] = { ...queries[index], ...params };
      return { queries: newQueries };
    }),

  updateSchema: () => {
    set({ isSchemaLoading: true });
    let graphQLParams = {
      query: getIntrospectionQuery(),
      operationName: 'IntrospectionQuery',
    };
    const { getCurrentQuery }: any = get();

    console.log('asdsa');

    fetcher(graphQLParams, getCurrentQuery())
      .then((response) => response.json())
      .then((result) => {
        if (typeof result !== 'string' && 'data' in result) {
          let schema = buildClientSchema(result.data);
          set(() => ({ schema }));
        }

        set({ isSchemaLoading: false, isSchemaError: false });
      })
      .catch((e) => {
        console.error(e);
        set({ isSchemaLoading: false, isSchemaError: true });
      });
  },
  setSchema: (schema) => set(() => ({ schema })),
  schema: null,

  fetchQuery: async (displayedData) => {
    const { getCurrentQuery }: any = get();
    const currentQuery = getCurrentQuery();

    set({ isQueryLoading: true });

    let temp = currentQuery.variables !== '{}';
    const json = await fetcher(
      { query: currentQuery.query, variables: temp ? currentQuery.variables : null },
      currentQuery,
    ).then((data) => data.json());

    let values: any = null;
    if ('data' in json) {
      if (currentQuery.displayed_data && currentQuery.displayed_data !== 'data') {
        if (currentQuery.data_type === 'flatten') {
          values = flattenData(json.data);
        } else {
          values = getValueFrom(json.data, displayedData);
        }
      } else {
        values = json.data;
        if ('extensions' in json) {
          values.extensions = json.extensions;
        }
      }
    }

    set({ isQueryLoading: false });

    return [json, values];
  },
}));
