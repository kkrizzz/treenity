import { meta } from '../../treenity/meta/meta.model';
import { types as t } from 'mobx-state-tree';
import { DataflowBlock } from "./core/Block";

export const Dataflow = meta('df.diagram', t.model({
    blocks: t.optional(t.array(DataflowBlock), []),
    links: t.optional(t.array(DataflowBlock), []),
}).actions(self => ({
    addBlock(block){
        self.blocks.push(block);
    }
})))
