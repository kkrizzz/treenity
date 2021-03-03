import {types as t} from 'mobx-state-tree';
import { randomId } from "../../../common/random-id";

export const blockTypes = {
}

const _id = t.optional(t.identifier, randomId());

const DataflowBlockPort =  t.model('df.block.port',{
    _id,
    label: t.string,
    type: t.string,
})

const DataflowBlockPorts = t.array(DataflowBlockPort);

const DataflowBlockPayload = t.array(t.model('df.block.payload', {
    label: t.string,
    type: t.string,
}))

const DataflowBlockView = t.model('df.block.view',{
    coordinates: t.optional(t.array(t.number), [0, 0])
})

export const DataflowBlock = t.model('df.block',{
    _id,
    _t: t.string,
    content: t.string,
    inputs: DataflowBlockPorts,
    outputs: DataflowBlockPorts,
    payload: DataflowBlockPayload,
    view: DataflowBlockView
})

export function registerBlock(name: string, model) {
    blockTypes[name] = () => DataflowBlock.create({...model, ...{_t: name}});
    return blockTypes[name];
}
