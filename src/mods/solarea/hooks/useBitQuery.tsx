import * as React from 'react';
import { BITQUERY_BASE } from '../config';
import { useGraphQL } from './useGraphQL';

export function useBitQuery(code: string) {
  return useGraphQL(BITQUERY_BASE, code, {
    'X-API-KEY': 'BQYnnYToTx5TrYrvKnSndyoBoBApLbN4',
  });
}
