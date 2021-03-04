import React, {useEffect, useState} from 'react';
import { useQuery } from 'react-query';
import {components, loadScript, useAccount, useAccountComponent} from './useAccount';
import useParams from './useParams';


export default function Preview({accountData, code}) {
  const [address] = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadScript(address, 'react', code).then(()=>setIsLoading(true));

  }, [code])

  if(!code) return null;
  if(!isLoading) return <div className="spinner"/>
  const Component = components[address]['react'];

  return <Component data={accountData} context="react" address={address}/>
}
