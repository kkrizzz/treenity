import React, { useRef } from 'react';
import { randomString } from '../utils/randomString';
import { block } from '../core/block';
import { lists } from './lists';
import { port } from '../core/port';
import { Button, Card, Input } from 'antd';
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;

const InputsBlockSubComponent = ({ controller, schema, block }) => {
  const [portName, setPortName] = React.useState('');

  const addPort = () => {
    if(!portName) return;

    schema.nodes.find((i) => i.id === block.id).outputs.push(port('out', portName, 'string'));
    controller.onChange(schema);

    setPortName('')
  };

  const removePort = (id) => {
      schema.links.forEach((i, index, obj) => {
          if(i.output === id) obj.splice(index, 1)
      })
      schema.nodes.find(i => i.id === block.id).outputs.forEach((i, index, obj) => {
          if(i.id === id) obj.splice(index, 1)
      });
      controller.onChange(schema);
  }

  return (
    <div style={{marginTop: 24}}>
      <Input placeholder="Port name" onChange={(e) => setPortName(e.target.value)} />
      <Button onClick={addPort}> Add port </Button>
      {block.outputs.map((port, key) => (
        <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgb(202, 202, 202)'}} key={key}>
            <div>{port.label}</div>
            <div style={{color: 'red'}} onClick={()=>removePort(port.id)}>x</div>
        </div>
      ))}
    </div>
  );
};

export function inputsBlock(coordinates): any {
  return block({
    content: 'Входные данные',
    coordinates,
    outputs: [],
    payload: {
      block: {
        type: inputsBlock.type,
      },
    },
  });
}

inputsBlock.type = 'db.blocks.common.inputs';
inputsBlock.subComponent = (props) => <InputsBlockSubComponent {...props} />;
inputsBlock.list = lists.DEFAULT;
inputsBlock.named = 'Входные данные';
inputsBlock.support = 'Это тестовый гайд для тестового блока.';
