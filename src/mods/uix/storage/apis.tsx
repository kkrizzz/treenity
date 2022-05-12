import { IStorageAdapter } from './adapters/IStorageAdapter';

export type Apis = { [protocol: string]: IStorageAdapter };
export const apis: Apis = {};

export function addApi(protocol: string, adapter: IStorageAdapter) {
  apis[protocol] = adapter;
}
