import { randomString } from '../utils/randomString';
import { block } from './block';
import {lists} from "./lists";

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

testBlock.list = lists.DEFAULT
testBlock.named = 'Тестовый блок';
testBlock.support = 'Это тестовый гайд для тестового блока.'
