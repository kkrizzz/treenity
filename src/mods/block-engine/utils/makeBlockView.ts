import {port} from "../../dataflow/core/port";

export const makeBlockView = (block) => {
    const {_id: id, content, inputs, outputs, view: { coordinates }} = block;
    return {
        id,
        content: content,
        inputs: inputs.map(i => port('in', i.label, i.type, i._id)),
        outputs: outputs.map(i => port('out', i.label, i.type, i._id)),
        coordinates,
        payload: {
            _t: block._t,
        }
    }
}