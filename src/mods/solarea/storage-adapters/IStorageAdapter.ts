import { SolareaViewId } from './SolareaViewId';
import { mimeTypesData } from '../utils/mime-types-data';
import { PublicKey } from '@solana/web3.js';

export class SolareaViewData {
  public id: SolareaViewId;
  public type: number;
  public data: Buffer;

  public owner?: PublicKey[];
  public dataSource?: string;

  constructor(id: SolareaViewId, type: number, data: Buffer, owner?: PublicKey[]) {
    this.id = id;
    this.type = type;
    this.data = data;
    this.owner = owner;
  }

  toJSON(): any {
    const json: any = {
      _id: this.id.id,
      data: this.data.toString('binary'),
      type: this.type,
    };
    if (this.owner) {
      json.owner = this.owner.map((key) => key.toBase58());
    }

    return json;
  }
}

export class SolareaLinkData extends SolareaViewData {
  linkTo: SolareaViewId;

  constructor(id: SolareaViewId, linkTo: SolareaViewId, owner?: PublicKey[]) {
    super(id, mimeTypesData['solarea/link'], Buffer.from(linkTo.id), owner);
    this.linkTo = linkTo;
  }
}

export interface IGetStorageOptions {
  resolveLinks?: boolean;
}

export interface IStorageAdapter {
  get(id: SolareaViewId, opts?: IGetStorageOptions): Promise<SolareaViewData>;
  save(data: SolareaViewData): Promise<void>;
  remove(id: SolareaViewId): Promise<void>;
}
