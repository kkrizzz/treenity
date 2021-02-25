import { randomString } from '../utils/randomString';
import { block } from '../core/block';
import { lists } from './lists';

export function kekiBlock(coordinates: any = [0, 0]): any {
  return block({
    content: 'Keki!',
    coordinates,
    outputs: [
      {
        label: 'kek',
        type: 'number',
      },
    ],
    payload: {
      block: {
        type: kekiBlock.type,
      },
    },
  });
}

kekiBlock.type = 'df.blocks.common.kek';
kekiBlock.list = lists.TEST;
kekiBlock.named = 'Кеки!';
kekiBlock.support = 'Это тестовый гайд для блока значения';
