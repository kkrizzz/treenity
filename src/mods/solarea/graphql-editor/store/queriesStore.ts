import create from 'zustand';
import { buildClientSchema, getIntrospectionQuery } from 'graphql';
import { fetcher } from '../api';
import { flattenData } from '../components/flattenData';
import { getValueFrom } from '../utils/common';

// const r = {
//   "query": "query MyQuery {\n  allFilms {\n    films {\n      episodeID\n      director\n      id\n      title\n    }\n  }\n}\n",
//     "variables": null,
//     "endpointID": "61c2ffc9b7cf23906b15b115",
//     "name": "Get all films",
//     "description": "List of all Star Wars films",
//
// }
export const useQueryStore = create<any>((set, get) => ({
  isSchemaLoading: false,
  isSchemaError: false,
  isQueryLoading: false,
  isQueryError: false,
  queries: [
    {
      _id: '1',
      query: '',
      variables: '{}',
      endpoint_url: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
      name: 'startWars',
    },
    {
      _id: '2',
      query: '',
      variables: '{}',
      data_type: 'response',
      config: {},
      endpoint_url: 'https://thegraph.wagyuswap.app/subgraphs/name/wagyu',
      name: 'wagy',
    },
  ],
  currentQueryID: null,
  setCurrentQuery(_id) {
    set(() => ({ currentQueryID: _id, schema: null }));
  },
  setQueries(queries) {
    set(() => ({ queries: queries, schema: null }));
  },

  getCurrentQuery() {
    const { queries, currentQueryID }: any = get();

    console.log(currentQueryID);
    if (!currentQueryID) return null;

    return queries.find((q) => q._id === currentQueryID);
  },

  updateQuery: (params) =>
    set(({ queries, currentQueryID }) => {
      const index = queries.findIndex((q) => q._id === currentQueryID);
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
    const currentQuery = get().getCurrentQuery();
    console.log(currentQuery);

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
