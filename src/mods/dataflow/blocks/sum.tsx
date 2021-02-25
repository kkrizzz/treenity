import React from 'react';
import { block } from '../core/block';
import { lists } from './lists';

export function sumBlock(coordinates: any = [0, 0]): any {
    return block({
        content: 'Сумматор',
        coordinates,
        outputs: [
            {
                label: 'result',
                type: 'number',
            },
        ],
        inputs: [
            {label: 'num1', type: 'number'},
            {label: 'num2', type: 'number'}
        ],
        payload: {
            block: {
                type: sumBlock.type,
            },
        },
    });
}

sumBlock.subComponent = () => null
sumBlock.type = 'df.blocks.common.sum';
sumBlock.list = lists.TEST;
sumBlock.named = 'Сумматор';
sumBlock.support = 'Это тестовый гайд для блока значения';
