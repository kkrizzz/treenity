import React from "react";
import {Diagram} from "beautiful-react-diagrams/dist";
import '../Dataflow.css'
import {blockTypes} from "../core/Block";
import {makeBlockView} from "../utils/makeBlockView";

export const DataflowWorkspace = ({onSave, schema, controller}) => {
    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDropBlock = (e) => {
        const block = blockTypes[e.dataTransfer.getData('text')]();
        schema.nodes.push(makeBlockView(block));
        controller.onChange(schema);
    }
    return (

        <div
            onDragOver={handleDragOver}
            onDrop={handleDropBlock}
            className="dataflow__workspace"
        >
            <Diagram schema={schema} onChange={controller.onChange} />
        </div>
    )
}