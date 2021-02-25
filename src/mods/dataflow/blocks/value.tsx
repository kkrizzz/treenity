import React from 'react';
import { block } from '../core/block';
import { lists } from "./lists";
import { port } from "../core/port";

const ValueBlockSubComponent = () => {
  return (
      <div>kek</div>
  )
}

export function valueBlock(coordinates: any = [0, 0]): any {
  return block({
    content: 'Значение',
    coordinates,
    outputs: [
      {
        label: 'value', type: 'any'
      }
    ],
    payload: {
      block: {
        type: valueBlock.type
      },
      value: ''
    },
  });
}

valueBlock.type = 'db.blocks.common.value'
valueBlock.subComponent = (props) => <ValueBlockSubComponent {...props}/>
valueBlock.list = lists.DEFAULT
valueBlock.named = 'Значение';
valueBlock.support = 'Это тестовый гайд для блока значения';
