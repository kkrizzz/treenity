import React, { useMemo } from 'react';
import { block } from '../core/block';
import { lists } from './lists';
import { Select } from 'antd';
import { mapDiagramsFromMetasNode } from '../utils/mapDiagramsFromNode';

const OtherDiagramBlockSubComponent = ({ controller, schema, block, meta }) => {
  const otherDiagramsFromNode = useMemo(() => mapDiagramsFromMetasNode(meta), []);

  const handleSelectDiagram = (e) => {
      const targetNode = otherDiagramsFromNode.find(node => node._id === e);
      schema.nodes.splice(schema.nodes.find(i => i.id === e), 1,  otherDiagramBlock({...targetNode, coordinates: block.coordinates}))
      controller.onChange(schema);
  }
  return (
    <div>
      Выберите диаграмму
      <Select onChange={handleSelectDiagram} defaultValue={block.payload.otherDiagramId} style={{ width: '100%' }}>
        {otherDiagramsFromNode.map((i, key) => (
          <Select.Option key={key} value={i._id}>{i.name}</Select.Option>
        ))}
      </Select>
    </div>
  );
};

export function otherDiagramBlock(
  { name, coordinates, inputs, outputs, _id } = {
    coordinates: [0, 0],
    name: '',
    inputs: [],
    outputs: [],
    _id: '',
  }
): any {
  return block({
    content: name,
    coordinates,
    inputs,
    outputs,
    payload: {
      block: {
        type: otherDiagramBlock.type,
      },
      otherDiagramId: _id,
    },
  });
}

otherDiagramBlock.type = 'db.blocks.common.diagram';
otherDiagramBlock.subComponent = (props) => <OtherDiagramBlockSubComponent {...props} />;
otherDiagramBlock.list = lists.DEFAULT;
otherDiagramBlock.named = 'Другая диаграмма';
otherDiagramBlock.support = 'Это тестовый гайд для тестового блока.';
