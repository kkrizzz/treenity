import React from 'react';
import { addComponent } from '../../treenity/context/context-db';
import { Dataflow } from './Dataflow.meta';
import 'beautiful-react-diagrams/dist/styles.css';
import { Button, Modal } from 'antd';
import { DataflowMenuItem } from './components/DataflowMenuItem';
import { createSchema, Diagram, useSchema } from 'beautiful-react-diagrams/dist';
import { makeBlockView } from './utils/makeBlockView';
import './Dataflow.css';
import { DataflowWorkspace } from './components/DataflowWorkspace';
import { blockTypes } from './core/Block';
import { DataflowSubMenu } from './components/DataflowSubmenu';
import {serializeSchema} from "./utils/serializeSchema";

addComponent(Dataflow, 'react', {}, ({ onChange, value }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const initialSchema = createSchema({
    nodes: value.blocks.map(makeBlockView),
  });

  const [schema, controller] = useSchema(initialSchema);

  const save = onChange(
    (value) => {
      value.a
    },
    [schema]
  );

  return (
    <div>
      <Button onClick={() => setIsVisible(true)}>Show</Button>
      <Modal
        onCancel={() => setIsVisible(false)}
        style={{ top: 24 }}
        bodyStyle={{ height: '800px' }}
        width="85%"
        maskClosable
        visible={isVisible}
      >
        <div className="dataflow">
          <div className="dataflow__blocks-menu">
            {Object.keys(blockTypes).map((blockType) => (
              <DataflowMenuItem _t={blockType} />
            ))}
          </div>
          <DataflowWorkspace
            onSave={save}
            schema={schema}
            controller={controller}
          />
          <DataflowSubMenu onSave={() => {}} />
        </div>
      </Modal>
    </div>
  );
});
