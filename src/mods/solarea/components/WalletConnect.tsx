import React from 'react';
import { useWallet } from '../utils/wallet';
import { Drawer } from './Drawer';
import './WalletConnect.css';
import {useLocalStorageState} from "../hooks/useLocalStorageState";

export default function WalletConnect() {
  const { connected, wallet, select, connect, disconnect, states } = useWallet();
  const { autoConnect, setAutoConnect } = states;
  const publicKey = (connected && wallet?.publicKey?.toBase58()) || '';

  return (
    <Drawer>
      <div className="wallet-connect">
        {publicKey && <div className="wallet-connect-btn wallet-connect-acc">{publicKey}</div>}
        <div className="wallet-connect-btn" onClick={connected ? disconnect : connect}>
          {connected ? 'Disconnect' : 'Connect'}
        </div>
        <b />
        <div className="wallet-connect-btn">
          <a href="?edit">Edit page</a>
        </div>
        <div className="wallet-connect-btn">
          Autoconnect <input checked={autoConnect as boolean} onChange={()=>setAutoConnect(!autoConnect)} type="checkbox"/>
        </div>
      </div>
    </Drawer>
  );
}
