import {
  AuthenticationBase,
  AuthenticationRequest,
  AuthenticationStrategy,
} from '@feathersjs/authentication';
import { Params } from '@feathersjs/feathers';
import { NotAuthenticated } from '@feathersjs/errors';
import { Application } from '@feathersjs/express';
import { Request } from 'express';
import mongoService from 'feathers-mongodb';
import createClientDb from '../../mongo/mongod';
import { Transaction } from '@solana/web3.js';

const { AuthenticationService } = require('@feathersjs/authentication');
const session = require('express-session');
const MongoStore = require('connect-mongo');

interface Req extends Request {
  session: {
    id: string;
    save: Function;
    pubkey: string;
  };
}

export class CryptoAuthService extends AuthenticationService {
  constructor(app) {
    super(app);
  }
  async create(data, params) {
    const authStrategies = params.authStrategies || this.configuration.authStrategies;
    if (!authStrategies.length) {
      throw new NotAuthenticated(
        'No authentication strategies allowed for creating a JWT (`authStrategies`)'
      );
    }
    return await this.authenticate(data, params, ...authStrategies);
  }
}

export class CryptoStrategy implements AuthenticationStrategy {
  name?: string;
  app?: Application;
  auth?: AuthenticationBase;

  private async setup() {
    this.app?.use(
      `/${this.auth?.configKey}/session`,
      mongoService({
        Model: (await createClientDb(this.app)).collection('crypto-session'),
        disableObjectify: true,
      }),
    );
  }

  setName(name) {
    this.name = name;
  }

  setApplication(app: Application): void {
    this.app = app;
  }

  async setAuthentication(auth: AuthenticationBase): Promise<void> {
    this.auth = auth;
    await this.setup();
  }

  async authenticate(data: AuthenticationRequest, params: Params) {
    const tx = params.transaction;
    if (!tx) throw Error('No transaction');

    const transaction = Transaction.from(tx.data);

    if (!transaction.feePayer) throw Error('No fee payer');

    if (!transaction.verifySignatures()) throw Error('Validation error');
    const pubkey = transaction.feePayer.toBase58();
    const sid = transaction.instructions[0].data.toString();
    const session = (await this.app?.service('session').find({ query: { pubkey, sid } }))[0];
    if (!session) throw Error('Something went wrong');

    await this.app?.services.session.patch(session._id, {
      ...session,
      valid: true,
    });

    return {
      result: 'qwe',
    };
  }
}
