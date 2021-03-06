import { ServiceMethods } from '@feathersjs/feathers';
import { MONGO_SERVICE_URL } from './config';

class RestStorageManager<T> implements ServiceMethods<T> {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async create(data: T): Promise<T> {
    const req = await fetch(this.baseUrl, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await req.json() as T;
  }

  async patch(_id: string, data): Promise<T> {
    const req = await fetch(`${this.baseUrl}/${_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await req.json() as T;
  }

  async get(id: string): Promise<T> {
    const req = await fetch(`${this.baseUrl}/${id}`);
    const json = await req.json();
    return (json as T);
  }

  async find(): Promise<any> {
    throw new Error('not_implemented');
  }

  async update(): Promise<any> {
    throw new Error('not_implemented');
  }

  async remove(): Promise<any> {
    throw new Error('not_implemented');
  }
}


export default RestStorageManager;

interface Entry {
  _id: string;
  data: string;
  link: string;
};
export const restStorageManager = new RestStorageManager<Entry>(MONGO_SERVICE_URL);
