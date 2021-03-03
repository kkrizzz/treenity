import React from 'react';
import { registerBlock } from '../core/Block';
import {addComponent} from "../../../treenity/context/context-db";

addComponent(registerBlock('df-blocks-common-sum', {
  content: 'Sum',
  outputs: [{ label: 'result', type: 'number' }],
  inputs: [
    { label: 'num1', type: 'number' },
    { label: 'num2', type: 'number' },
  ],
  payload: [
    {
      label: 'Арифметическая операция',
      type: 'string',
    },
  ],
  view: { coordinates: [0, 0] },
}), 'df.diagram', {}, () => {
  return <div>Hello</div>
});
