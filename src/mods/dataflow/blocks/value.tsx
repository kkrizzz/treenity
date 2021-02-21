import { randomString } from '../utils/randomString';
import { block } from './block';
import { lists } from "./lists";

export function valueBlock(coordinates: any = [0, 0]): any {
  return block({
    content: 'Значение',
    coordinates,
    outputs: [
      {
        id: randomString(20),
        alignment: 'left',
        label: 'Hello, world!'
      },
    ],
    payload: {
      value: ''
    },
  });
}

valueBlock.list = lists.DEFAULT
valueBlock.named = 'Значение';
valueBlock.support = 'Это тестовый гайд для блока значения';
