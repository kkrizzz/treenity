import create from 'zustand'

export const useQueryStore = create(set => ({
	currentQuery: {
		query: '',
		variables: '{}',
		data_type: 'response',
		config: {},
		endpoint_url: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
		id: null
	},
	schema: null,
	setSchema: (schema) => set(() => ({ schema: schema })),
	updateQuery: (params) => set((state) => ({ currentQuery: {...state.currentQuery, ...params} })),
}))
