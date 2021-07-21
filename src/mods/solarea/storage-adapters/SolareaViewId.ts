import { makeId } from '../utils/make-id';

export class SolareaViewId {
  address: string;
  context: string;
  name: string;
  id: string;

  constructor(address, name?, context?) {
    this.address = address;
    this.name = name || 'default';
    this.context = context || 'react';

    this.id = makeId(this.address, this.name, this.context);
  }
}
