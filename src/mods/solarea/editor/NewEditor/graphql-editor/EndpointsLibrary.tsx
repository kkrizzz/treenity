import React, { FC, useState } from 'react';
import './GraphQLEditor.css';
import './editor.css';
import { Endpoint, useEndpoints } from './hooks/useEndpoints';
import styled, { css } from 'styled-components';
import EndpointCard from '../components/EndpointCard';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Button from '../components/Button';

interface EndpointsLibraryProps {
  onChooseEndpoint: (endpoint: Endpoint) => void;

  onCreateCustomQuery: (url: string) => void;
}
const EndpointsLibrary: FC<EndpointsLibraryProps> = ({ onChooseEndpoint, onCreateCustomQuery }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [url, setUrl] = useState('');
  const { endpoints, isEndpointsLoading } = useEndpoints();

  return (
    <EndpointsGalleryContainer>
      <h2>last viewed</h2>
      <div className="endpoints-gallery__endpoints">
        {isEndpointsLoading
          ? 'Loading'
          : endpoints?.map((endpoint) => (
              <EndpointCard
                title={endpoint.url.split('/')[2]}
                name={endpoint.name}
                description={endpoint.description}
                onClick={() => onChooseEndpoint(endpoint)}
              />
            ))}

        <EndpointCard
          title={'Custom endpont'}
          name={'Create custom endpont'}
          description={''}
          onClick={() => {
            setShowAddModal(true);
          }}
        />
      </div>

      <Modal isVisible={showAddModal} onClose={() => setShowAddModal(false)}>
        <h2>Create custom endpont</h2>
        <Input label={'URL'} value={url} onChange={(event) => setUrl(event.target.value)} />

        <div style={{ display: 'flex' }}>
          <Button
            style={{ marginLeft: 'auto', marginTop: 12 }}
            onClick={() => {
              onCreateCustomQuery(url);
              setUrl('');
              setShowAddModal(false);
            }}
          >
            Create
          </Button>
        </div>
      </Modal>
    </EndpointsGalleryContainer>
  );
};

const EndpointsGalleryContainer = styled.div(
  (p) => css`
    padding: 20px 20px 20px 6px;

    h2 {
      font-family: Inter;
      font-style: normal;
      font-weight: 900;
      font-size: 12px;
      line-height: 12px;
      text-transform: uppercase;
      color: ${p.theme.colors.text.primary};
      margin-bottom: 16px;
      margin-top: 0;
    }

    .endpoints-gallery__endpoints {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-row-gap: 20px;
      grid-column-gap: 20px;
    }
  `,
);

const QueriesLibraryContainer = styled.div`
  display: flex;
  width: calc(100vw - 60px);
  height: calc(100vh - 16px);

  * {
    color: white;
  }
  //background: #292d3e;

  .queries-library-container__endpoints {
    border-right: 1px solid rgb(53, 58, 81);
    width: 300px;
    height: 100%;
    display: grid;
    grid-auto-rows: min-content;
    grid-row-gap: 4px;

    & > h2 {
      padding-left: 8px;
    }

    & > div {
      cursor: pointer;
      padding: 8px;
      background: #474c5e;
    }

    & > div:hover {
      background: #585e75;
    }

    & > div.active {
      background: #585e75;
    }

    & > div > p {
      color: #9aa5ce;
      font-size: small;
    }
  }
`;

export default EndpointsLibrary;
