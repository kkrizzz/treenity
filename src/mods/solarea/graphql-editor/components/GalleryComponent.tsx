import React from 'react'
import { useQueryStore } from '../store/queriesStore'
import QueryBuilder from './QueryBuilder/index'
import { makeDefaultArg, getDefaultScalarArgValue } from "./QueryBuilder/CustomArgs"

const GalleryComponent = () => {
	const { currentQuery,updateQuery, schema } = useQueryStore()

	// const [url, setUrl] = useState(QueriesStore.currentQuery.endpoint_url)

	return (
		<div className={'gallery flex flex-col active'} >
			{/*<div style={{margin: '0 4px'}}>*/}
			{/*	<input*/}
			{/*		placeholder="URL"*/}
			{/*		value={url}*/}
			{/*		onChange={(e) => setUrl(e.target.value)}*/}
			{/*		style={{marginRight: 4, width: '80%'}}*/}
			{/*	/>*/}
			{/*	<button onClick={()=>{*/}
			{/*		QueriesStore.updateQuery({endpoint_url: url}, 0)*/}

			{/*	}}>Set</button>*/}


			{/*</div>*/}
			<QueryBuilder
				width={'300px'}
				minWidth={'300px'}
				title={'Builder'}
				schema={schema}
				query={currentQuery.query}
				onEdit={query=>updateQuery({query}, 0)}
				explorerIsOpen={true}
				getDefaultScalarArgValue={getDefaultScalarArgValue}
				makeDefaultArg={makeDefaultArg}
			/>
		</div>
	)
}

export default GalleryComponent
