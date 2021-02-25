import React from 'react';
import { randomString } from '../utils/randomString';
import { block } from '../core/block';
import { lists } from './lists';
import { port } from '../core/port';

const TestBlockSubComponent = ({ controller, schema, block }) => {
  return <div>subMenuComponent</div>;
};

export function testBlock(coordinates: any = [0, 0]): any {
  return block({
    content: 'Тестовый блок',
    coordinates,
    inputs: [{ type: 'number', label: 'test' }],
    outputs: [{ type: 'boolean', label: 'test' }],
    payload: {
      block: {
        type: testBlock.type,
      },
    },
  });
}

testBlock.type = 'db.blocks.common.test';
testBlock.subComponent = (props) => <TestBlockSubComponent {...props}/>;
testBlock.list = lists.DEFAULT;
testBlock.named = 'Тестовый блок';
testBlock.support = 'Это тестовый гайд для тестового блока.';
