import * as preact from 'preact/compat';
import { css, useCSS } from '../hooks/useCSS';
import { useBitQuery } from '../hooks/useBitQuery';
import { useAccount } from '../hooks/useAccount';
import { useAccountTransactions } from '../hooks/useAccountTransactions';
import Render, { render } from '../render/Render';
import { RenderCode } from '../render/RenderCode';

export function createExecutionContext() {
  return {
    Render,
    render,
    RenderCode,

    preact,
    useCSS,
    css,
    useBitQuery,
    useAccount,
    useAccountTransactions,
  };
}
