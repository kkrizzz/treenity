import { randomString } from '../utils/randomString';
import { block } from './block';

export function valueBlock(coordinates: any = [0, 0]): any {
  return block({
    content: 'Значение',
    coordinates,
    outputs: [
      {
        id: randomString(20),
        alignment: 'left',
      },
    ],
    payload: {
      value: ''
    }
  });
}

valueBlock.named = 'Значение';
valueBlock.support = 'Это тестовый гайд для блока значения';
