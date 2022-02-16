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
  currentQuery: null,
  schema: null,

  setCurrentQuery(query) {
    console.log(query);
    set(() => ({ currentQuery: query || undefined, schema: null }));
  },
  updateCurrentQuery: (params) =>
    set(({ currentQuery }) => ({ currentQuery: { ...currentQuery, ...params } })),

  updateSchema: () => {
    const { currentQuery }: any = get();
    if (!currentQuery) return;

    set({ isSchemaLoading: true });
    let graphQLParams = {
      query: getIntrospectionQuery(),
      operationName: 'IntrospectionQuery',
    };

    fetcher(graphQLParams, currentQuery)
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

  fetchQuery: async (displayedData) => {
    const currentQuery = get().currentQuery;
    console.log(currentQuery);
    if (!currentQuery?._id) return [];

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
