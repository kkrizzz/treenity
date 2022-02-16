import {
  IGetStorageOptions,
  IStorageAdapter,
  SolareaLinkData,
  SolareaViewData,
} from './IStorageAdapter';
import RestStorageManager from './rest-storage-manager';
import { MONGO_SERVICE_URL } from '../config';
import { mimeTypesData } from '../utils/mime-types-data';
import { SolareaViewId } from './SolareaViewId';
import { WalletAdapterInterface } from '../utils/wallet';
import { PublicKey } from '@solana/web3.js';
import memoize from 'lodash/memoize';
import { loadQueryFromComponent } from '../editor/NewEditor/graphql-editor/api';
import IComponentQuery from '../editor/NewEditor/types/IComponentQuery';

interface Entry {
  _id: string;
  data: string;
  type: number;
  owner?: string[];
}

function jsonToViewData(json: Entry): SolareaViewData {
  const owners = json.owner?.map((owner) => new PublicKey(owner));

  const data =
    json.type === mimeTypesData['solarea/link']
      ? new SolareaLinkData(
          SolareaViewId.fromString(json._id),
          SolareaViewId.fromString(json.data),
          owners,
        )
      : new SolareaViewData(
          SolareaViewId.fromString(json._id),
          json.type,
          Buffer.from(json.data, 'utf-8'),
          owners,
        );
  data.dataSource = 'rest';
  return data;
}

export class RestStorageAdapter implements IStorageAdapter {
  restManager: RestStorageManager<SolareaViewData>;

  validateWallet() {
    if (!this.walletConnection.wallet || !this.walletConnection.connected) {
      this.walletConnection.select();
      return false;
    }
    if (!this.walletConnection.session || !this.walletConnection.signed) {
      this.walletConnection.authorizeWithTx();
      return false;
    }
    return true;
  }

  constructor(private walletConnection: WalletAdapterInterface) {
    this.restManager = new RestStorageManager<SolareaViewData>(
      MONGO_SERVICE_URL,
      walletConnection.session,
      jsonToViewData,
    );
  }

  _loadView(id: string): Promise<[SolareaViewData, IComponentQuery[]]> {
    return Promise.all([this.restManager.get(id), loadQueryFromComponent(id)]);
  }

  get = memoize(
    async (id: SolareaViewId, opts?: IGetStorageOptions): Promise<SolareaViewData> => {
      let [viewData, queries] = await this._loadView(id.id);
      if (opts?.resolveLinks) {
        while (viewData.type === mimeTypesData['solarea/link']) {
          [viewData, queries] = await this._loadView((viewData as SolareaLinkData).linkTo.id);
        }
      }
      if (viewData) viewData.queries = queries;
      return viewData;
    },
    (id, opts) => `${id.id}${opts?.resolveLinks}`,
  );

  async remove(id: SolareaViewId): Promise<void> {
    await this.restManager.remove(id.id);
  }

  async save(data: SolareaViewData): Promise<void> {
    if (!this.validateWallet()) return;

    const obj = await this.get(data.id).catch(() => null);
    if (obj) {
      await this.restManager.patch(data.id.id, data);
    } else {
      await this.restManager.create(data);
    }
  }
}
