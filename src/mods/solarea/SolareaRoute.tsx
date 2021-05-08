import React from 'react';
import bs58 from 'bs58';

import useParams from './hooks/useParams';
import useQueryParams from './hooks/useQueryParams';
import Render from './Render';
import SolanaEdit from './SolanaEdit';
import findMap from '../../utils/find-map';
import { SolanaWalletValidator } from './wallet/SolanaWalletValidator';

const idToViewResolvers = [
  (id, name, context, { edit, ...props }) => {
    if (edit !== undefined) {
      return <SolanaEdit {...props} value={null} id={id} name={name} context={context} />;
    }
  },
  (id, name, context, query) => {
    if (name !== 'default') return;
    let exName = '';
    // transaction
    if (id.length >= 64 && bs58.decodeUnsafe(id)?.length === 64) {
      exName = 'tx';
    } else if (id.length >= 32 && bs58.decode(id)?.length === 32) {
      exName = 'account';
    } else if (!Number.isNaN(parseInt(id))) exName = 'block';
    if (exName) {
      return (
        <Render id="explorer" name="layout" context={context}>
          <Render {...query} entityId={id} id="explorer" context={context} name={exName} />
        </Render>
      );
    }
  },
  (id, name, context, query) => {
    // all other names
    return (
      <Render id="layout" name="default" context={context}>
        <Render {...query} id={id} context={context} name={name} />
      </Render>
    );
  },
];

function resolveView(id: string, name: string, context: string, query) {
  return findMap(idToViewResolvers, (resolver) => resolver(id, name, context, query));
}

export default function SolareaRoute() {
  let [id, name, context] = useParams();
  const query = useQueryParams();

  const ctx = `react${context && !context.startsWith('react') ? ` ${context}` : ''}`;

  return resolveView(id, name, ctx, query);
}
