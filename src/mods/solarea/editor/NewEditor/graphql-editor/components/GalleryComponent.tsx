import React from 'react';
import { useQueryStore } from '../store/queriesStore';
import QueryBuilder from './QueryBuilder';
import { makeDefaultArg, getDefaultScalarArgValue } from './QueryBuilder/CustomArgs';

const GalleryComponent = () => {
  const { updateCurrentQuery, schema, currentQuery } = useQueryStore();

  return (
    <div className={'gallery flex flex-col active'}>
      <QueryBuilder
        width={'300px'}
        minWidth={'300px'}
        title={'Builder'}
        schema={schema}
        query={currentQuery.query}
        onEdit={(query) => updateCurrentQuery({ query })}
        explorerIsOpen={true}
        getDefaultScalarArgValue={getDefaultScalarArgValue}
        makeDefaultArg={makeDefaultArg}
      />
    </div>
  );
};

export default GalleryComponent;
