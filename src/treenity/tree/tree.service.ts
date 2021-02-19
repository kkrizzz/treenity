import { Application, Id, NullableId, Paginated, Params, Service, ServiceMethods } from '@feathersjs/feathers';
import { each, some } from 'lodash';
import Oplog from 'mongo-oplog';
import sift from 'sift';
import { toJS } from 'mobx';
import { isStateTreeNode } from 'mobx-state-tree';


import { makeUpdateFromActions } from '../model/make-patch-update';
import { Node, UnionMetaType } from './node';

import { randomId } from '../../common/random-id';
import assert from 'assert';
import { Instance, SnapshotIn } from 'mobx-state-tree';
import { check } from '../../utils/check';
import { Channel, RealTimeConnection } from '@feathersjs/transport-commons/lib/channels/channel/base';
import { getTypeContextConfig } from '../context/context-db';
import { applyResolver } from './collection-resolver';

const cache = {};
const subscriptions: {
  [cookie: string]: {
    ids: { [_id: string]: number },
    queries: { [subId: string]: any },
    subs: { [subId: string]: { [_id: string]: boolean } }
    connection: RealTimeConnection,
  }
} = {};

type InNode = SnapshotIn<typeof Node>;

export default class TreeService implements ServiceMethods<InNode> {
  collection!: Service<any>;
  changes!: Service<any>;
  app: any;

  oplogQueue: string[] = [];

  setup(app: Application, path: string) {
    this.app = app;
    this.collection = app.service('nodes');
    this.changes = app.service('changes');
    const service = app.service(path);

    // try to enable oplog for tree
    const mongoUrl = app.get('mongodb');
    const lastSlash = mongoUrl.lastIndexOf('/');
    const oplogUrl = mongoUrl.slice(0, lastSlash) + '/local';
    const dbName = mongoUrl.slice(lastSlash + 1);


    this.oplog = Oplog(oplogUrl, { ns: `${dbName}\.nodes` });
    this.oplog.on('insert', doc => {
      if (this.oplogQueue.remove(doc.o._id) >= 0) return;
      this.checkObject(doc.o, true);
      this.emit('created', doc.o);
    });
    this.oplog.on('delete', doc => this.emit('removed', doc.o._id));
    this.oplog.on('update', async doc => {
      const _id = doc.o2._id;
      if (this.oplogQueue.remove(_id) >= 0) return;
      const obj = await this.collection.get(_id);
      this.checkObject(obj, false);
      this.emit('updated', obj);
    });
    this.oplog.tail();


    service.publish('created', (data, { channel }) => {
      return channel || app.channel(data._id);
    });
    service.publish('patched', (patch) => {
      // publish this changes to object channel and parent object channel
      return app.channel(patch.id);
    });
    service.publish('updated', (data) => {
      // publish this changes to object channel and parent object channel
      return app.channel(data._id);
    });
    service.publish('removed', (id, { channel }) => {
      if (channel) return channel;

      const chan = app.channel(id);
      chan.emit('empty'); // remove channel
      return chan;
    });

    app.on('disconnect', (connection) => {
      delete subscriptions[connection.headers.cookie];
    });

    const disableEvent = (ctx) => {
      ctx.event = null;
      return ctx;
    };
    service.hooks({
      after: {
        create: [disableEvent],
        patch: [(ctx) => {
          if (!ctx.result) ctx.event = null;
        }],
        update: [disableEvent],
        remove: [disableEvent],
      },
    });
  }

  subscribe(connection: RealTimeConnection, objects: InNode[], subId: string = randomId(), query) {
    const { cookie } = connection.headers;
    const { ids, queries } = (subscriptions[cookie] ||= { ids: {}, subs: {}, queries: {}, connection });
    (queries[subId] ||= []).push(query);

    // create optimizedd tree matcher, maybe in Rust to fast-filter queries
    // all subscription queries making a tree, soo ony tree matched, and all the same aueries batched to one
    // like we have: [{ _id: 'root' }, { _id: 'test' }, { _id: 'root' }], merged to _id -> ['root']: [0, 2], ['test']: [1]
    // [{ _id: 'root' }, { _id: 'root', _m.num: 10 }] => _id: ['root']: [0] -> '_m.num': 10: [1]
    objects.forEach((o) => {
      const id = o._id.toString();
      // increment info count
      if (!ids[id]) {
        ids[id] = 1;
        this.app.channel(id).join(connection);
      }
    });

    return subId;
  }

  checkObject(obj, isCreate) {
    const joined: RealTimeConnection[] = [];
    const leaved: RealTimeConnection[] = [];
    each(subscriptions, ({ queries, ids, connection }, cookie) => {
      const _id = obj._id;
      const onClient = !isCreate && !!ids[_id];
      const matched = some(queries, (qs) => qs.find(query => sift(query)(obj)));
      if (matched === onClient) return;
      if (matched) {
        ids[_id] = 1;
        this.app.channel(_id).join(connection);
        if (!isCreate) joined.push(connection);
      } else {
        delete ids[_id];
        this.app.channel(_id).leave(connection);
        leaved.push(connection);
      }
    });
    if (joined.length) this.emit('created', obj, { channel: new Channel(joined) });
    if (leaved.length) this.emit('removed', obj._id, { channel: new Channel(leaved) });
  }

  removeFromSubs(id: Id): void {
    each(subscriptions, (ids, subs) => {
      if (!ids[id]) return;

      // each(subs, (sub) => delete sub[id]);
      delete ids[id];
    });
  }

  unsubscribe(connection, subId) {
    if (!subId) return;

    const cookie = connection.headers.cookie;
    const info = subscriptions[cookie];

    if (!info) return; // XXX

    // XXX check all the objs in subs
    const { queries, subs, ids } = info;
    delete queries[subId];

    // const sub = subs[subId];
    // delete subs[subId];
    //
    // each(sub, (_, id) => {
    //   const n = --ids[id];
    //   assert(n >= 0, 'invalid id');
    //   if (n === 0) {
    //     delete ids[id];
    //     this.app.channel(id).leave(connection);
    //   }
    // });
  }

  async find(params: Params): Promise<InNode | InNode[] | Paginated<InNode> | null> {
    let { query: { subscribe, resolver, subId, ...query } } = params;

    console.log('find', params.query);

    if (subscribe === false && params.connection) {
      this.unsubscribe(params.connection, subId);
      return null;
    }

    if (!resolver) throw new Error('set resolver');

    const resolverNode = await this.collection.get(resolver);

    const data = await applyResolver(resolverNode, query, this.app);

    // const data = await this.collection.find({ query });
    if (subscribe === true && params.connection) {
      const subId = this.subscribe(params.connection, data, randomId(), query);

      return { data, subId };
    }
    return { data, total: data.length, skip: 0, limit: data.length };
  }

  async get(id: Id, params: Params) {
    return this.collection.get(id);
  }
  async create(data: any, params: Params) {
    // data._id = randomId();
    // this.oplogQueue.push(data._id);
    const jsonData = isStateTreeNode(data) ? data.toJSON() : data;

    const obj = await this.collection.create(jsonData, params);
    await this.changes.create({ _id: obj._id, _: [{ op: 'add', path: '/', value: data }] }, params);
    // const subId = this.subscribe(params.connection, [obj], 'create');
    return obj;
  }

  // async update(id: NullableId, data: any, params: Params) {
  //   console.log('updating');
  // }
  async patch(id: string, actions: any, params: Params) {
    const snapshot = await this.collection.get(id);
    const node = Node.create(snapshot, { app: this.app });
    const [[update, extraUpdate], patch] = makeUpdateFromActions('', node, actions);
    if (patch.length === 0) return null;

    update.$set = update.$set || {};
    update.$set.updatedAt = Date.now();
    update.$inc = { _r: 1 };

    console.log('patching', id, actions);

    this.oplogQueue.push(id);

    let obj = await this.collection.patch(id, update);
    if (extraUpdate) obj = await this.collection.patch(id, extraUpdate);

    await this.changes.patch(id, { $push: { _: { ...patch, at: new Date() } } });

    this.checkObject(obj, false);
    // this.emit('patched', { id, patch });
    return { id, p: obj._p, r: obj._r, patch };
    // return patch;
    // this.emit(id, patch);
    // this.app.channel(id).send(patch);
  }

  async remove(id: Id, params: Params): Promise<NullableId> {
    check(id, 'id not defined');
    if (id && (await this.collection.remove(id).catch(() => false)) !== false) {
      this.removeFromSubs(id);
    }
    return id;
  }

  update(
    id: NullableId,
    data: Instance<typeof Node>,
    params?: Params,
  ): Promise<Instance<typeof Node>[] | Instance<typeof Node>> {
    throw new Error('update not implemented');
  }

  [key: string]: any;
}
