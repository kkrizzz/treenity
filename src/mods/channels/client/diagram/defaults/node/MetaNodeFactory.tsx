import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { MetaNodeModel } from './MetaNodeModel';
import { MetaNodeWidget } from './MetaNodeWidget';
import { IMeta } from '../../../../../../treenity/meta/meta.model';

export class MetaNodeFactory extends AbstractReactFactory<MetaNodeModel, DiagramEngine> {
  constructor() {
    super('meta');
  }

  generateReactWidget(event): JSX.Element {
    return <MetaNodeWidget engine={this.engine} node={event.model} />;
  }

  generateModel(event): MetaNodeModel {
    // const metaType = getMeta(event.typeName);
    return new MetaNodeModel(null!);
  }

  generateModelByMeta(meta: IMeta): MetaNodeModel {
    return new MetaNodeModel(meta);
  }
}
