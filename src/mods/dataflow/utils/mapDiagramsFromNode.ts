import {otherDiagramBlock} from "../blocks/otherDiagram";

export function mapDiagramsFromMetasNode(meta): Array<{name, coordinates, outputs, inputs, _id}> {
    return meta.node._m
        .filter((i) => i._t === 'df.diagram' && i._id !== meta._id)
        .map((n) => {
            if(!n.schema) return null
            const parsedSchemeFromOtherDiagram = JSON.parse(n.schema).nodes
            const {outputs} = parsedSchemeFromOtherDiagram.find(t=>t.payload.block.type === 'db.blocks.common.inputs');
            const {inputs} = parsedSchemeFromOtherDiagram.find(t=>t.payload.block.type === 'db.blocks.common.outputs');
            return {
                _id: n._id,
                name: `${n._id}.Тестовая диагрмма`,
                coordinates: [0, 0],
                outputs,
                inputs
            }}).filter(i => i !== null)
}