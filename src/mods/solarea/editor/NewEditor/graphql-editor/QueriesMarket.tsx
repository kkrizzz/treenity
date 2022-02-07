import React, { useState } from 'react';

import { useQueryStore } from './store/queriesStore';
import EndpointsLibrary from './EndpointsLibrary';
import { Endpoint } from './hooks/useEndpoints';
import EndpointQueries from './EndpointQueries';
import { toast } from '../../../utils/toast';
import { addQueryToComponent } from './api';
import QueryEditor from './QueryEditor';

const QueriesMarket = ({ viewId }) => {
  const { setCurrentQuery, currentQuery } = useQueryStore();
  const [currentEndpoint, setCurrentEndpoint] = useState<Endpoint | null>(null);

  if (!currentEndpoint)
    return (
      <div>
        <EndpointsLibrary onChooseEndpoint={setCurrentEndpoint} />
      </div>
    );

  if (currentQuery == null)
    return (
      <EndpointQueries
        endpoint={currentEndpoint}
        onChooseQuery={(query) => {
          setCurrentQuery({ ...query, endpoint_url: currentEndpoint.url });
        }}
        onBack={() => setCurrentEndpoint(null)}
      />
    );

  return (
    <QueryEditor
      onSaveText={'Add to my workspace'}
      onSave={() =>
        addQueryToComponent(viewId.id, currentQuery).then(() => {
          toast('Query was added to component workspace');
        })
      }
      onClose={() => setCurrentQuery(null)}
    />
  );
};

export default QueriesMarket;
