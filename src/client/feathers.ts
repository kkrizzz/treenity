import io from 'socket.io-client';

import { feathers } from '@feathersjs/feathers';
import authentication, { Storage } from '@feathersjs/authentication-client';
import socketio from '@feathersjs/socketio-client';
import config from '../config-common';
import { getSnapshot } from 'mobx-state-tree';

const url = window.location;

const socket = io(`http://${url.host}:${url.port}`);
const client = feathers();

client.configure(socketio(socket));
client.configure(
  authentication({
    storage: (window.localStorage as unknown) as Storage,
  }),
);

export default client;
