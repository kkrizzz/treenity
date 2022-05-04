import { useMemo } from 'react';
import { t, meta, addComponent, getTypeContextConfig } from '../../treenity';
import { getType } from 'mobx-state-tree';

type id = string;
type url = string;

interface LeTyped {
  id: string;
  type: string;
}

interface LePort extends LeTyped {
  dir: 'in' | 'out';
}

interface LeNode extends LeTyped {
  ports: LePort[];
  ins: LeLink[];
  outs: LeLink[];
  run(props, methods);
}

interface LeLink {
  from: url;
  to: url;
}

const portValues = {};

function usePort(port) {
  return portValues[`${port.nodeId}_${port.name}`];
}

function setPort(port, value) {
  portValues[`${port.nodeId}_${port.name}`] = value;
}

async function CombineNodeComponent({ str, num }, { setPort }) {
  setPort('out', str + num);
}
// const CombineNodeComponent = ({ ports: { portIn, portOut }, value: { increment } }) => {
//   const [value, { updated }] = usePort(portIn);
//
//   const x = useMemo(() => value + increment, [value]);
//
//   setPort(portOut, x);
// };

// function (Component, context, options) {}
const CombineNode = meta('le2.node.combine', t.model({}));

addComponent(
  CombineNode,
  'le2.node',
  {
    ports: [
      {
        id: 'str',
        dir: 'in',
        type: 'string',
      },
      {
        id: 'num',
        dir: 'in',
        type: 'string',
      },
      {
        id: 'out',
        dir: 'out',
        type: 'string',
      },
    ],
  },
  // @ts-ignore
  CombineNodeComponent,
);

const types: {
  [type: string]: { [context: string]: any };
} = {};

function createNode(data: any, links: any): LeNode | undefined {
  const type = getType(data);
  const config = getTypeContextConfig(type.name, 'le2.node');
  if (!config) throw new Error(`not found: node for type ${type.name}/le2.node`);
  const id = data._id;
  return {
    id,
    ins: config.ports.filter((p) => p.dir === 'in').map((p) => links[`${id}#${p.id}`]),
    outs: config.ports.filter((p) => p.dir === 'out').map((p) => links[`${id}#${p.id}`]),
    type: type.name,
    ports: config.ports,
    run: config.component,
  };
}

interface LeScript extends LeTyped {
  ports: LePort[];
  links: LeLink[];
  nodes: LeNode[];
}

interface LeProcess {
  inputs: { [port: id]: any };
}

class LogicEngine2 {
  scripts: LeScript[] = [];

  constructor(private nodeFactory) {}

  loadScript(script: LeScript) {
    this.scripts.push(script);
  }

  runScript(id: id, process: LeProcess) {
    const script = this.scripts.find((s) => s.id === id);
    if (!script) throw new Error(`not found: script ${id}`);

    // collect and resolve all links
    const links = {};
    script.links.forEach((l) => {
      const link = {
        ...l,
        fromNode: script.
      }
      links[l.from] = l;
      links[l.to] = l;
    });

    // collect and resolve all nodes
    const nodes = {};

    script.nodes.forEach((n) => {
      nodes[n.id] = this.nodeFactory(n, links);
    });

    const inPorts = script.ports.filter((p) => p.dir === 'in');

    const inNodes = inPorts.map((p) => {
      const from = `#${p.id}`;
      return script.links.find((l) => l.from === from);
    });

    // script.links.find((l) => l.from === inPorts);
  }
}

async function main() {
  const engine = new LogicEngine2((data, links) => createNode(data, links));

  const p: LePort = { id: 'in1', type: 'string', dir: 'out' };

  const script = {
    id: 'script1',
    type: 'le-script',
    ports: [p, p],
    links: [
      { from: '#in1', to: 'node1#str' },
      { from: '#in2', to: 'node1#num' },
    ],
    nodes: [CombineNode.create({ _id: 'node1' })],
  };
  engine.loadScript(script);
  engine.runScript('script1', {
    inputs: { in1: 'test', in2: 42 },
  });
}

main().then(console.log, console.error);
