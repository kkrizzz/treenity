import { makeId } from '../utils/make-id';
import { createViewAddress } from '../program-api/solarea-program-api';

export class SolareaViewId {
  readonly address: string;
  readonly context: string;
  readonly name: string;
  readonly id: string;

  constructor(address: string, name?: string, context?: string) {
    this.address = address;
    this.name = name || 'default';
    this.context = context || 'react';

    this.id = makeId(this.address, this.name, this.context);
  }

  static fromString(id: string): SolareaViewId {
    const [address, context, name] = id.split('~');
    return new SolareaViewId(address, name, context);
  }

  get storageAddress() {
    return createViewAddress(this.address, this.context, this.name);
  }
}
