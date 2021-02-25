import React from 'react';
import { block } from '../core/block';
import { lists } from './lists';
import {port} from "../core/port";
import {Button, Input} from "antd";

const OutputsBlockSubComponent = ({ controller, schema, block }) => {
    const [portName, setPortName] = React.useState('');

    const addPort = () => {
        if(!portName) return;

        schema.nodes.find((i) => i.id === block.id).inputs.push(port('in', portName, 'string'));
        controller.onChange(schema);

        setPortName('')
    };

    const removePort = (id) => {
        schema.links.forEach((i, index, obj) => {
            if(i.input === id) obj.splice(index, 1)
        })
        schema.nodes.find(i => i.id === block.id).inputs.forEach((i, index, obj) => {
            if(i.id === id) obj.splice(index, 1)
        });
        controller.onChange(schema);
    }

    return (
        <div style={{marginTop: 24}}>
            <Input placeholder="Port name" onChange={(e) => setPortName(e.target.value)} />
            <Button onClick={addPort}> Add port </Button>
            {block.inputs.map((port, key) => (
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgb(202, 202, 202)'}} key={key}>
                    <div>{port.label}</div>
                    <div style={{color: 'red'}} onClick={()=>removePort(port.id)}>x</div>
                </div>
            ))}
        </div>
    );
};

export function outputsBlock(coordinates): any {
    return block({
        content: 'Выходные данные',
        coordinates,
        outputs: [],
        payload: {
            block: {
                type: outputsBlock.type,
            },
        },
    });
}

outputsBlock.type = 'db.blocks.common.outputs';
outputsBlock.subComponent = (props) => <OutputsBlockSubComponent {...props}/>;
outputsBlock.list = lists.DEFAULT;
outputsBlock.named = 'Выходные данные';
outputsBlock.support = 'Это тестовый гайд для тестового блока.';
