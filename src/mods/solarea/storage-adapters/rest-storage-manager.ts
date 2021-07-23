import { ServiceMethods } from '@feathersjs/feathers';
import { errors, FeathersError } from '@feathersjs/errors';
import { MONGO_SERVICE_URL } from '../config';
import { SolareaViewData } from './IStorageAdapter';

function checkError(req: any) {
  if (req.status >= 300) {
    if (errors[req.status]) throw new errors[req.status]();
    throw new FeathersError(req.statusText, 'Error', req.status, '', {});
  }
}

class RestStorageManager<T> implements ServiceMethods<T> {
  constructor(
    private baseUrl: string,
    private session: string,
    private transform: (json: any) => T,
  ) {}

  async fetch(suffix: string, method: string, body?: any): Promise<T> {
    const req = await fetch(this.baseUrl + (suffix ? '/' + suffix : ''), {
      method,
      headers: {
        session: this.session,
        'Content-Type': 'application/json',
      },
      body: body && JSON.stringify(body),
    });
    checkError(req);
    return this.transform(await req.json());
  }

  async create(data: Partial<T>): Promise<T> {
    return this.fetch('', 'POST', data);
  }

  async patch(_id: string, data: T): Promise<T> {
    return await this.fetch(_id, 'PATCH', data);
  }

  async get(_id: string): Promise<T> {
    return await this.fetch(_id, 'GET');
  }

  async remove(_id: string): Promise<T> {
    return await this.fetch(_id, 'DELETE');
  }

  async find(): Promise<any> {
    throw new Error('not_implemented');
  }

  async update(): Promise<any> {
    throw new Error('not_implemented');
  }

  async setup(app: any, path: string): Promise<void> {
    // do nothing
  }
}

export default RestStorageManager;
