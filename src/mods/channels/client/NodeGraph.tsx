import React, { useMemo, useState } from 'react';
import createEngine, { DiagramEngine, DiagramModel } from '@projectstorm/react-diagrams';
import { DefaultLinkModel, DefaultNodeModel } from './diagram/defaults';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

const ResizeObserver = require('resize-observer-polyfill');
ResizeObserver.default = ResizeObserver;

import DemoCanvasWidget from './DemoCanvasWidget';
import { MetaNodeFactory } from './diagram/defaults/node/MetaNodeFactory';
import { ResourcesMeta } from '../metas/resource.meta';

// function useResource(creator, changes) {
//
// }
const nodeFactory = new MetaNodeFactory();

export const NodeGraph = (props) => {
  useState();
  const [engine, model] = useMemo(() => {
    //1) setup the diagram engine
    var engine = createEngine();
    engine.getNodeFactories().registerFactory(nodeFactory);

    //2) setup the diagram model
    var model = new DiagramModel();

    // //3-A) create a default node
    // var node1 = new DefaultNodeModel({
    //   name: 'Node 1',
    //   color: 'rgb(0,192,255)',
    // });
    // node1.setPosition(100, 100);
    // let port1 = node1.addOutPort('Out');
    //
    // //3-B) create another default node
    // var node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
    // let port2 = node2.addInPort('In');
    // node2.setPosition(400, 100);
    //
    // // link the ports
    // let link1 = port1.link<DefaultLinkModel>(port2);
    // link1.getOptions().testName = 'Test';
    // link1.addLabel('Hello World!');
    //
    // //4) add the models to the root graph
    // model.addAll(node1, node2, link1);

    //5) load model into engine
    engine.setModel(model);

    return [engine, model];
  }, []);

  const D = 1000 * 60 * 60 * 24;
  const rand = (n, s = 0) => Math.floor(Math.random() * n) + s;
  const addNode = () => {
    const name = /*prompt('Node name', 'New node') ||*/ 'Unknown';
    const node2 = nodeFactory.generateModelByMeta(
      ResourcesMeta.create({
        _id: 'some-id' + rand(1e8),
        resources: [
          { dir: 'in', name: 'money', amount: 10, period: 1 * D },
          { dir: 'in', name: 'if', amount: 10, period: 1 * D },
          { dir: 'out', name: 'honey' },
          { dir: 'out', name: 'else' },
        ],
      }),
    );

    // var node2 = new DefaultNodeModel(name, `rgb(${rand(256)},${rand(256)},${rand(256)})`);
    // let port2 = rand(2) > 0 ? node2.addInPort('In') : node2.addOutPort('Out');
    node2.setPosition(rand(400, 100), rand(200));

    engine.getModel().addNode(node2);
    engine.repaintCanvas();
  };

  const serialize = () => {
    console.log('serialize', engine.getModel().serialize());
  };

  return (
    <div style={{ height: 600 }}>
      <button onClick={addNode}>Add node</button>
      <button onClick={serialize}>Serialize</button>
      <DemoCanvasWidget>
        <CanvasWidget engine={engine} />
      </DemoCanvasWidget>
    </div>
  );
};
