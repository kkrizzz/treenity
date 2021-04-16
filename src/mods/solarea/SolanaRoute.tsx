import React from 'react';
import useParams from './hooks/useParams';
import useQueryParams from './hooks/useQueryParams';
import Render from './Render';
import SolanaEdit from './SolanaEdit';
import { useWallet } from './utils/wallet';
import { useTransaction } from "./hooks/useTransaction";

const SolareaInfo = ({children}) => {
  return (
      <div style={{textAlign: "center", fontSize: 40, marginTop: "20%"}}>
        {children}
      </div>
  )
}

const SolareaEditValidator = ({ children }) => {
  const { wallet, connected } = useWallet();

  if (!wallet) {
    return <SolareaInfo>Login to edit</SolareaInfo>;
  }

  if (wallet && !connected) {
    return <SolareaInfo>Connecting to wallet ...</SolareaInfo>;
  }

  if (wallet && connected) {
    return children
  }

  return null;
};

export default function SolanaRoute() {
  let [id, name, context] = useParams();

  const ctx = `react${context && context !== 'react' ? ` ${context}` : ''}`;

  const { edit, ...props } = useQueryParams();
  if (edit !== undefined)
    return (
      <SolareaEditValidator>
        <SolanaEdit {...props} value={null} id={id} name={name} context={ctx} />
      </SolareaEditValidator>
    );

  if (id === 'layout') {
    return <Render id={id} context={ctx} name={name} />;
  }

  return <Render id="layout" context={ctx}>
    <Render {...props} id={id} context={ctx} name={name} />
  </Render>;
}
