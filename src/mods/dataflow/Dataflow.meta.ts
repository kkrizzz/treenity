import { meta } from '../../treenity/meta/meta.model';
import { types as t } from 'mobx-state-tree';

const DataflowInOutData = t.model('df.diagram.',{
    label: t.string,
})

const InOutData =  t.optional(t.array(DataflowInOutData), []);

export const Dataflow = meta('df.diagram', t.model({
    schemaName: t.optional(t.string, ''),
    schema: t.optional(t.string, ''),
    inputs: InOutData,
    outputs: InOutData
}).actions(self => ({
    updateSchema: (newSchema) => {
        self.schema = newSchema;
    }
})))
