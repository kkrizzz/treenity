import { mimeTypesData } from '../../utils/mime-types-data';

export class SolareaViewData {
  public url: string;
  public type: number;
  public data: Buffer;

  public owner?: string[];
  public dataSource?: 'rest' | 'solana';
  queries?: any;

  constructor(url: string, type: number, data: Buffer, owner?: string[]) {
    this.url = url;
    this.type = type;
    this.data = data;
    this.owner = owner;
  }

  toJSON(): any {
    const json: any = {
      _id: this.url,
      data: this.data.toString('binary'),
      type: this.type,
    };
    // if (this.owner) {
    //   json.owner = this.owner.map((key) => key.toBase58());
    // }

    return json;
  }
}

export class SolareaLinkData extends SolareaViewData {
  linkTo: string;

  constructor(url: string, linkTo: string, owner?: string[]) {
    super(url, mimeTypesData['solarea/link'], Buffer.from(linkTo), owner);
    this.linkTo = linkTo;
  }
}

export interface IGetStorageOptions {
  resolveLinks?: boolean;
}

export interface IStorageAdapter {
  get(url: string, opts?: IGetStorageOptions): Promise<SolareaViewData>;
  save(data: SolareaViewData): Promise<void>;
  remove(url: string): Promise<void>;
}
