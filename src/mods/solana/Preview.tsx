import React from 'react';
import { useQuery } from 'react-query';
import {loadScript, useAccount, useAccountComponent} from './useAccount';
import useParams from './useParams';


export default function Preview() {
  const [address, name = 'any'] = useParams();
  const [accData, isAccLoading] = useAccount(address);
  const [Component, loading, data] = useAccountComponent(address, 'react', name);

  return Component && <>
    <Component address={address} name={name} context="react" />
  </>;
}
