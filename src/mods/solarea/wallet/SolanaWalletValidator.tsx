import React from 'react';
import { useWallet } from '../utils/wallet';

const SolareaInfo = ({ children }) => {
  return <div style={{ textAlign: 'center', fontSize: 40, marginTop: '20%' }}>{children}</div>;
};

export const SolanaWalletValidator = ({ children }) => {
  const { wallet, connected } = useWallet();

  if (!wallet) {
    return <SolareaInfo>Login to edit</SolareaInfo>;
  }

  if (wallet && !connected) {
    return <SolareaInfo>Connecting to wallet ...</SolareaInfo>;
  }

  if (wallet && connected) {
    return children;
  }

  return null;
};
