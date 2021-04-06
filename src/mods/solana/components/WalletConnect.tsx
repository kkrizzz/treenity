import React from 'react';
import { useWallet } from '../utils/wallet';

export default function WalletConnect() {
  const { connected, wallet, select, connect, disconnect } = useWallet();
  const publicKey = (connected && wallet?.publicKey?.toBase58()) || '';

  return (
    <>
      <div style={{color: 'white'}}>{publicKey}</div>
      <button onClick={connected ? disconnect : connect}>
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </>
  );
}
