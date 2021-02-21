import { randomString } from '../utils/randomString';
import { block } from './block';

export function testBlock(coordinates: any = [0, 0]): any {
  return block({
    content: 'Тестовый блок',
    coordinates,
    inputs: [
      {
        id: randomString(20),
        alignment: 'left',
      },
    ],
  });
}

testBlock.named = 'Тестовый блок';
testBlock.support = 'Это тестовый гайд для тестового блока.'
