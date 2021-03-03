import { randomString } from '../utils/randomString';
import { Port } from '../types/Port';
import { port } from "./port";
import { ReactNode } from "react";

export function block({
  content,
  inputs = [],
  outputs = [],
  coordinates = [0, 0],
  payload = {},
  render,
}: {
  content: string;
  inputs?: Array<Port>;
  outputs?: Array<Port>;
  coordinates?: Array<number>;
  payload?: any;
  render?: ReactNode
}) {
  return {
    id: randomString(20),
    content,
    inputs: inputs.map(i => port('in', i.label, i.type)),
    outputs: outputs.map(i => port('out', i.label, i.type)),
    coordinates: coordinates,
    payload,
    render,
  };
}
