import { meta } from '../../treenity/meta/meta.model';
import { types as t } from 'mobx-state-tree';

export const Dataflow = meta('df.diagram', t.model({
    schema: t.optional(t.string, '')
}).actions(self => ({
    updateSchema: (newSchema) => {
        self.schema = newSchema;
    }
})))
