import React, { useState } from 'react';

import { useQueryStore } from './store/queriesStore';
import EndpointsLibrary from './EndpointsLibrary';
import { Endpoint } from './hooks/useEndpoints';
import EndpointQueries from './EndpointQueries';
import { toast } from '../../../utils/toast';
import { addQueryToComponent } from './api';
import QueryEditor from './QueryEditor';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';

const QueriesMarket = ({ viewId }) => {
  const { setCurrentQuery, currentQuery } = useQueryStore();
  const [currentEndpoint, setCurrentEndpoint] = useState<Endpoint | null>(null);

  if (currentQuery != null)
    return (
      <QueryEditor
        onSaveText={'Add to component'}
        onSave={(query) => {
          addQueryToComponent(viewId.id, query).then(() => {
            toast('Query was added to component workspace');
          });
        }}
        onClose={() => setCurrentQuery(null)}
        nameEditable={true}
      />
    );

  if (!currentEndpoint)
    return (
      <div>
        <EndpointsLibrary
          onChooseEndpoint={setCurrentEndpoint}
          onCreateCustomQuery={(url) => {
            setCurrentQuery({
              _id: 'none',
              query: '',
              variables: null,
              endpoint_url: url,
              name: 'New Query',
              endpointID: '',
            });
          }}
        />
      </div>
    );

  return (
    <EndpointQueries
      endpoint={currentEndpoint}
      onChooseQuery={(query) => {
        setCurrentQuery({ ...query, endpointURL: currentEndpoint.url });
      }}
      onBack={() => setCurrentEndpoint(null)}
    />
  );
};

export default QueriesMarket;
