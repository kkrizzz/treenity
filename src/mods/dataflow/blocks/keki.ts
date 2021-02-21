import { randomString } from '../utils/randomString';
import { block } from './block';
import { lists } from "./lists";

export function kekiBlock(coordinates: any = [0, 0]): any {
    return block({
        content: 'Keki!',
        coordinates,
        outputs: [
            {
                id: randomString(20),
                alignment: 'left',
                label: 'Hello, world!'
            },
        ],
        payload: {
            lol: ''
        },
    });
}

kekiBlock.list = lists.TEST
kekiBlock.named = 'Кеки!';
kekiBlock.support = 'Это тестовый гайд для блока значения';
