import {
  NodeModel,
  NodeModelGenerics,
  PortModelAlignment,
} from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from '../port/DefaultPortModel';
import { BasePositionModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';
import getTypeName from '../../../../../../treenity/meta/get-type-name';
import { IMeta } from '../../../../../../treenity/meta/meta.model';
import { getMembers } from 'mobx-state-tree';
import { IResourceMeta } from '../../../../metas/resource.meta';

export interface DefaultNodeModelOptions extends BasePositionModelOptions {
  name?: string;
  color?: string;
}

export interface DefaultNodeModelGenerics extends NodeModelGenerics {
  OPTIONS: DefaultNodeModelOptions;
}

export class MetaNodeModel extends NodeModel<DefaultNodeModelGenerics> {
  protected portsIn: DefaultPortModel[];
  protected portsOut: DefaultPortModel[];
  protected portsCorner: DefaultPortModel[];

  public meta: IMeta;

  // constructor(name: string, color: string);
  // constructor(options?: DefaultNodeModelOptions);
  constructor(meta: IMeta, options?: DefaultNodeModelOptions) {
    const typeName = getTypeName(meta);
    super({
      id: meta._id,
      type: 'meta',
      name: typeName,
      color: '#EFEFEF',
      ...options,
    });
    this.meta = meta;
    const members = getMembers(meta);

    this.portsOut = []; //ports.filter((r) => !r.in);
    this.portsIn = []; // ports.filter((r) => r.in);
    this.portsCorner = [];

    const ports = (meta as IResourceMeta).resources
      .map(
        (r) =>
          new DefaultPortModel({ in: r.dir === 'in', name: r.name, label: r.name, id: r.name }),
      )
      .forEach((port) => this.addPort(port));

    this.addCornerPort('start', PortModelAlignment.LEFT, true);
    this.addCornerPort('stop', PortModelAlignment.RIGHT, false);
    this.addCornerPort('error', PortModelAlignment.RIGHT, false);
  }

  doClone(lookupTable: {}, clone: any): void {
    clone.portsIn = [];
    clone.portsOut = [];
    super.doClone(lookupTable, clone);
  }

  addCornerPort(name: string, alignment: PortModelAlignment, isIn = true) {
    const port = new DefaultPortModel({
      in: isIn,
      name: name,
      label: name,
      alignment,
    });
    super.addPort(port);
    this.portsCorner.push(port);
  }
  getCornerPort(name: string): DefaultPortModel | undefined {
    return this.portsCorner.find((p) => p.getOptions().name === name);
  }

  removePort(port: DefaultPortModel): void {
    super.removePort(port);
    if (port.getOptions().in) {
      this.portsIn.splice(this.portsIn.indexOf(port), 1);
    } else {
      this.portsOut.splice(this.portsOut.indexOf(port), 1);
    }
  }

  addPort<T extends DefaultPortModel>(port: T): T {
    super.addPort(port);
    if (port.getOptions().in) {
      if (this.portsIn.indexOf(port) === -1) {
        this.portsIn.push(port);
      }
    } else {
      if (this.portsOut.indexOf(port) === -1) {
        this.portsOut.push(port);
      }
    }
    return port;
  }

  addInPort(label: string, after = true): DefaultPortModel {
    const p = new DefaultPortModel({
      in: true,
      name: label,
      label: label,
      alignment: PortModelAlignment.LEFT,
    });
    if (!after) {
      this.portsIn.splice(0, 0, p);
    }
    return this.addPort(p);
  }

  addOutPort(label: string, after = true): DefaultPortModel {
    const p = new DefaultPortModel({
      in: false,
      name: label,
      label: label,
      alignment: PortModelAlignment.RIGHT,
    });
    if (!after) {
      this.portsOut.splice(0, 0, p);
    }
    return this.addPort(p);
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.options.name = event.data.name;
    this.options.color = event.data.color;
    this.portsIn = event.data.portsInOrder.map((id) =>
      this.getPortFromID(id),
    ) as DefaultPortModel[];
    this.portsOut = event.data.portsOutOrder.map((id) =>
      this.getPortFromID(id),
    ) as DefaultPortModel[];
  }

  serialize(): any {
    return {
      ...super.serialize(),
      name: this.options.name,
      color: this.options.color,
      portsInOrder: this.portsIn.map((port) => port.getID()),
      portsOutOrder: this.portsOut.map((port) => port.getID()),
    };
  }

  getInPorts(): DefaultPortModel[] {
    return this.portsIn;
  }

  getOutPorts(): DefaultPortModel[] {
    return this.portsOut;
  }
}
