import * as React from 'react';
import styled from '@emotion/styled';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from './DefaultPortModel';

import { InputPort, OutputPort } from '../node';

export interface DefaultPortLabelProps {
  port: DefaultPortModel;
  engine: DiagramEngine;
}

namespace S {
  export const PortLabel = styled.div`
    display: flex;
    margin-top: 1px;
    align-items: center;
  `;

  export const Label = styled.div`
    padding: 0 5px;
    flex-grow: 1;
    cursor: pointer;
  `;

  export const Port = styled.div<{ alignment: string }>`
    width: 16px;
    height: 16px;
    background: rgba(204, 28, 28, 0.62);
    text-align: center;
    margin: 3px 0;

    border-top-${(p) => (p.alignment === 'left' ? 'right' : 'left')}-radius: 50%;
    border-bottom-${(p) => (p.alignment === 'left' ? 'right' : 'left')}-radius: 50%;

    &:hover {
      background: rgb(192, 255, 0);
    }
  `;

  export const CornerPort = styled.div<{ aligment: string; color: string }>`
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid ${(p) => p.color || 'black'};
    border-${(p) => p.aligment}-radius: 5px;

    &:hover {
      background: rgb(192, 255, 0);
    }
  `;
}

export function DefaultPortLabel(props: DefaultPortLabelProps) {
  const options = props.port.getOptions();
  const Port = options.in ? InputPort : OutputPort;

  return (
    <Port
      symbol="S"
      name={options.name}
      widget={<PortWidget engine={props.engine} port={props.port} />}
    />
  );
}

interface CornerPortLabelProps extends DefaultPortLabelProps {
  component: React.Component<any>;
}

export function CornerPortLabel({ port, engine, component: PortComponent }: CornerPortLabelProps) {
  const options = port.getOptions();

  return (
    <PortWidget engine={engine} port={port}>
      <PortComponent color={options.color} />
    </PortWidget>
  );
}
