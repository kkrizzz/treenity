import React from 'react';
import { useWallet } from '../utils/wallet';
import { Drawer } from './Drawer';
import './WalletConnect.css';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

export default function WalletConnect() {
  const { connected, wallet, select, connect, disconnect, states } = useWallet();
  const { autoConnect, setAutoConnect } = states;
  const publicKey = (connected && wallet?.publicKey?.toBase58()) || '';

  return null;
}
