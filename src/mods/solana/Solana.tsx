import React, { useEffect, useState } from 'react';
import SolanaCreate from './SolanaCreate';
import {loadScript, useAccount, useAccountComponent} from './useAccount';
import useParams from './useParams';
import StorageManager from "./storageInterface";
import {add} from "winston";
import {SolanaView} from "./SolanaVIew";

export default function Solana() {
  const [address, name = 'any', edit] = useParams();
  const [loadEnd, setLoadEnd] = useState<boolean>(false);
  const [view, setView] = useState<any>(null);
  const [accountData, accountLoading] = useAccount(address);

  useEffect(() => {
    StorageManager.findView(address, name).then(([v])=> {
      setLoadEnd(true);
      setView(v);
    })
  }, [])
  if(!loadEnd && accountLoading) return <div className="spinner"/>

  if (edit) return <SolanaCreate view={view} accountData={accountData}/>
  else return <SolanaView accountData={accountData} view={view}/>
}
