import React from 'react';
import { useQueryStore } from '../store/queriesStore';
import QueryBuilder from './QueryBuilder/index';
import { makeDefaultArg, getDefaultScalarArgValue } from './QueryBuilder/CustomArgs';

const GalleryComponent = () => {
  const { updateQuery, schema } = useQueryStore();

  const currentQuery = useQueryStore((state) => state.getCurrentQuery());

  return (
    <div className={'gallery flex flex-col active'}>
      <QueryBuilder
        width={'300px'}
        minWidth={'300px'}
        title={'Builder'}
        schema={schema}
        query={currentQuery.query}
        onEdit={(query) => updateQuery({ query }, 0)}
        explorerIsOpen={true}
        getDefaultScalarArgValue={getDefaultScalarArgValue}
        makeDefaultArg={makeDefaultArg}
      />
    </div>
  );
};

export default GalleryComponent;
