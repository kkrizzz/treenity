import * as preact from 'preact/compat';
import { css, useCSS } from '../hooks/useCSS';
import { useBitQuery } from '../hooks/useBitQuery';
import { useAccount } from '../hooks/useAccount';
import { useAccountTransactions } from '../hooks/useAccountTransactions';
import Render, { render } from '../Render';

export function createExecutionContext() {
  return {
    Render,
    render,

    preact,
    useCSS,
    css,
    useBitQuery,
    useAccount,
    useAccountTransactions,
  };
}
