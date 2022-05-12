import React, { ChangeEvent, ElementType, ReactNode, useMemo } from 'react';
import { addComponent } from '../../treenity/context/context-db';
import { Dataflow } from './Dataflow.meta';
import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams/dist';
import 'beautiful-react-diagrams/dist/styles.css';
import './Dataflow.css';
import { DataflowMenuItem } from './components/DataflowMenuItem';
import { testBlock } from './blocks/test-block';
import { dataflowBlocks } from './blocks';
import { Button, Input } from 'antd';
import { block } from './blocks/block';

addComponent(Dataflow, 'react layout', {}, ({ onChange, value }) => {
  const initialSchema = createSchema({
    nodes: [
      testBlock([100, 100]),
      ...value.node.metas.map((meta) => {
        return block({ content: `${meta._t}.${meta._id}` });
      }),
    ],
  });

  const [schema, controller] = useSchema(initialSchema);

  const [additionalInfo, setAdditionalInfo] = React.useState(
    schema.nodes.map((i) => ({ id: i.id })),
  );

  const [selectedNodeId, setSelectedNodeId] = React.useState<any>(undefined);

  const handleDropBlock = (e) => {
    const blockIndex = e.dataTransfer.getData('text');
    const targetBlockType = dataflowBlocks[blockIndex];
    const targetNode = targetBlockType([e.nativeEvent.layerX, e.nativeEvent.layerY]);

    setAdditionalInfo((prevState) => {
      return [...prevState, { id: targetNode.id }];
    });

    controller.addNode(targetNode);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const saveSchema = onChange((value, schema) => value.set({ schema: JSON.stringify(schema) }));

  const selectedNode = useMemo(() => {
    return schema.nodes.find((n) => n.id === selectedNodeId);
  }, [selectedNodeId]);

  const updateNodePayload = (e: ChangeEvent<HTMLInputElement>, key) => {
    const newValue = e.target.value;
    setAdditionalInfo((prevState) => {
      const newState = [...prevState];
      const targetNodeIndex = newState.findIndex((i) => i.id === selectedNodeId);
      newState[targetNodeIndex][key] = newValue;
      return newState;
    });
  };

  return (
    <div className="dataflow">
      <div className="dataflow__blocks-menu">
        <Input.Search size="large" enterButton placeholder="Название блока" />
        <div className="dataflow__blocks-menu__search-list">
          {dataflowBlocks.map((block, index) => (
            <DataflowMenuItem index={index} key={index} />
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          {selectedNode && (
            <div>
              <div>Выбранная нода: {selectedNodeId}</div>
              {Object.keys(selectedNode.payload).map((k, index) => (
                <Input
                  key={index}
                  value={additionalInfo.find((i) => i.id === selectedNodeId)[k]}
                  onChange={(e) => updateNodePayload(e, k)}
                  placeholder={k}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="dataflow__workspace">
        <div className="dataflow__workspace__toolbar">
          <Button onClick={() => saveSchema(schema)}>Save</Button>
          <Button onClick={() => console.log(additionalInfo)}>Test</Button>
        </div>
        <div
          className="dataflow__workspace__diagram"
          onDragOver={handleDragOver}
          onDrop={handleDropBlock}
        >
          <Diagram
            schema={schema}
            onChange={controller.onChange}
            onSelectNode={(e) => setSelectedNodeId(e.id)}
          />
        </div>
      </div>
    </div>
  );
});
