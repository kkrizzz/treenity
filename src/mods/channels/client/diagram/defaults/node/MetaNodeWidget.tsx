import * as React from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultNodeModel } from './DefaultNodeModel';
import { CornerPortLabel, DefaultPortLabel } from '../port/DefaultPortLabelWidget';
import styled from '@emotion/styled';
import {
  HeaderRightDiv,
  RunOutputPort,
  RunInputPort,
  HeaderLeftDiv,
  VarsInputDiv,
  VarsOutputDiv,
  HeaderDiv,
  NodeDiv,
  ErrorPort,
  CardBodyDiv,
  CardFooterDiv,
  Title,
} from '../node';

// namespace S {
// export const Node = styled.div<{ background: string; selected: boolean }>`
//   background-color: ${(p) => p.background};
//   border-radius: 5px;
//   font-family: sans-serif;
//   color: #26233f;
//   //border: solid 2px black;
//   overflow: visible;
//   font-size: 11px;
//   border: solid 1px ${(p) => (p.selected ? '#27AE60' : '#A7A2BD')};
// `;

// export const Header = styled.div`
//   background: rgba(0, 0, 0, 0.3);
//   display: flex;
//   white-space: nowrap;
//   justify-items: center;
//   align-items: center;
//   height: 32px;
//   margin: -1px;
// `;

// export const Title = styled.div`
//   background: rgba(0, 0, 0, 0.3);
//   display: flex;
//   white-space: nowrap;
//   justify-items: center;
// `;

// export const TitleName = styled.div`
//   flex-grow: 1;
//   padding: 5px 5px;
// `;
//
// export const Ports = styled.div`
//   display: flex;
//   //background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
// `;

//   export const PortsContainer = styled.div`
//     flex-grow: 1;
//     display: flex;
//     flex-direction: column;
//
//     &:first-of-type {
//       margin-right: 10px;
//     }
//
//     &:only-child {
//       margin-right: 0px;
//     }
//   `;
// }

export interface DefaultNodeProps {
  node: DefaultNodeModel;
  engine: DiagramEngine;
}

/**
 * Default node that models the DefaultNodeModel. It creates two columns
 * for both all the input ports on the left, and the output ports on the right.
 */
export class MetaNodeWidget extends React.Component<DefaultNodeProps> {
  generatePort = (port) => {
    return <DefaultPortLabel engine={this.props.engine} port={port} key={port.getID()} />;
  };
  generateSidePort = (port, component) => {
    return (
      <CornerPortLabel
        component={component}
        port={port}
        key={port.getID()}
        engine={this.props.engine}
      />
    );
  };

  render() {
    const node = this.props.node;
    const options = node.getOptions();
    return (
      <NodeDiv
        data-default-node-name={options.name}
        selected={node.isSelected()}
        background={options.color!}
      >
        <HeaderDiv>
          <HeaderLeftDiv>
            {this.generateSidePort(node.getCornerPort('start'), RunInputPort)}
            <Title>{options.name}</Title>
          </HeaderLeftDiv>
          <HeaderRightDiv>
            {this.generateSidePort(node.getCornerPort('stop'), RunOutputPort)}
          </HeaderRightDiv>
        </HeaderDiv>
        <CardBodyDiv>
          <VarsInputDiv>{node.getInPorts().map(this.generatePort)}</VarsInputDiv>
          <VarsOutputDiv>{node.getOutPorts().map(this.generatePort)}</VarsOutputDiv>
        </CardBodyDiv>
        <CardFooterDiv>
          {this.generateSidePort(node.getCornerPort('error'), ErrorPort)}
        </CardFooterDiv>
      </NodeDiv>
    );
  }
}
