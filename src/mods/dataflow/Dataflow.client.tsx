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
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { Collapse } from 'antd';
import { lists } from './blocks/lists';

const { Panel } = Collapse;

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
    schema.nodes.map((i) => ({ id: i.id }))
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

  const MenuItemLists = useMemo(() => {
    return Object.keys(lists).map((list, listIndex) => {
      const targetList = lists[list];
      return (
        <Panel key={listIndex} header={targetList.name}>
          {dataflowBlocks
            .filter((block) => block.list === lists[list])
            .map((item, itemIndex) => (
              <DataflowMenuItem index={dataflowBlocks.indexOf(item)} key={itemIndex} />
            ))}
        </Panel>
      );
    });
  }, []);

  const removeNode = (nodeId: string) => {
    const targetNode = schema.nodes.find((i) => i.id === nodeId);
    if (!targetNode) return;

    controller.removeNode({ id: nodeId });
  };

  return (
    <div className="dataflow">
      <div className="dataflow__blocks-menu">
        {/*<Input.Search size="large" enterButton placeholder="Название блока" />*/}
        <div className="dataflow__blocks-menu__search-list">
          <Collapse defaultActiveKey="0">{MenuItemLists}</Collapse>
        </div>
      </div>
      <div className="dataflow__workspace">
        <ContextMenuTrigger attributes={{ style: { height: '100%' } }} id="same_unique_identifier">
          {selectedNodeId && (
            <ContextMenu
              hideOnLeave
              className="dataflow__workspace__context-menu"
              id="same_unique_identifier"
            >
              <MenuItem
                className="dataflow__workspace__context-menu_item"
                onClick={() => removeNode(selectedNodeId)}
              >
                Удалить
              </MenuItem>
            </ContextMenu>
          )}
          <div
            className="dataflow__workspace__diagram"
            onDragOver={handleDragOver}
            onDrop={handleDropBlock}
            onClick={() => setSelectedNodeId(undefined)}
          >
            <Diagram
              schema={schema}
              onChange={controller.onChange}
              onSelectNode={(e) => {
                setSelectedNodeId(e.id);
                e.event.stopPropagation();
              }}
            />
          </div>
        </ContextMenuTrigger>
      </div>
      <div className="dataflow__sub-menu">
        {selectedNode ? (
          <div>
            <div>Выбранная нода: {'\n' + selectedNodeId}</div>
            {Object.keys(selectedNode.payload).map((k, index) => (
              <Input
                key={index}
                value={additionalInfo.find((i) => i.id === selectedNodeId)[k]}
                onChange={(e) => updateNodePayload(e, k)}
                placeholder={k}
              />
            ))}
          </div>
        ) : (
          <div className="dataflow__workspace__toolbar">
            <Button onClick={() => saveSchema(schema)}>Save</Button>
            <Button onClick={() => console.log(schema)}>Test</Button>
          </div>
        )}
      </div>
    </div>
  );
});
