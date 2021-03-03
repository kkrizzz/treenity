import React from 'react';
import { useQuery } from 'react-query';
import { loadScript, useAccount } from './useAccount';
import useParams from './useParams';


export default function Preview({ code }) {
  const [address, name = 'any'] = useParams();

  const [accData, isAccLoading] = useAccount(address);
  const { data: scriptData, isLoading } = useQuery(code, () => loadScript(address, 'react', code));

  if (isLoading || isAccLoading) return null;

  const [Component] = scriptData;

  return Component && <>
    {code}
    <Component address={address} data={accData!.data} name={name} context="react" />
  </>;
}
