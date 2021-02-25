import React from 'react';
import { block } from '../core/block';
import { lists } from './lists';

const OtherDiagramBlockSubComponent = ({ controller, schema, block }) => {
    return <div>subMenuComponent</div>;
};

export function otherDiagramBlock(name, coordinates: any = [0, 0], inputs, outputs): any {
    return block({
        content: name,
        coordinates,
        inputs,
        outputs,
        payload: {
            block: {
                type: otherDiagramBlock.type,
            },
        },
    });
}

otherDiagramBlock.type = 'db.blocks.common.diagram';
otherDiagramBlock.subComponent = (props) => <OtherDiagramBlockSubComponent {...props}/>;
otherDiagramBlock.list = lists.DEFAULT;
otherDiagramBlock.named = 'Другая диаграмма';
otherDiagramBlock.support = 'Это тестовый гайд для тестового блока.';
