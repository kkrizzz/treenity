import { testBlock } from "./test-block.tsx";
import { valueBlock } from "./value";
import { kekiBlock } from "./keki";
import { inputsBlock } from "./inputs.tsx";
import { outputsBlock } from "./outputs.tsx";
import {sumBlock} from "./sum.tsx";
import {otherDiagramBlock} from "./otherDiagram.tsx";

export const dataflowBlocks = [
    testBlock,
    valueBlock,
    kekiBlock,
    inputsBlock,
    outputsBlock,
    sumBlock,
    otherDiagramBlock
]