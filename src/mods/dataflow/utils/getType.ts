import {dataflowBlocks} from "../blocks";

export const getType = (type) => {
    return dataflowBlocks.find(i => i.type === type) || undefined
}