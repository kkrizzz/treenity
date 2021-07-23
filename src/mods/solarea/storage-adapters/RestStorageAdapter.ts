import { IStorageAdapter, SolareaLinkData, SolareaViewData } from './IStorageAdapter';
import RestStorageManager from './rest-storage-manager';
import { MONGO_SERVICE_URL } from '../config';
import { mimeTypesData } from '../utils/mime-types-data';
import { SolareaViewId } from './SolareaViewId';
import { WalletAdapterInterface } from '../utils/wallet';
import { PublicKey } from '@solana/web3.js';

interface Entry {
  _id: string;
  data: string;
  type: number;
  owner?: string[];
}

function jsonToViewData(json: Entry): SolareaViewData {
  const owners = json.owner?.map((owner) => new PublicKey(owner));

  if (json.type === mimeTypesData['solarea/link']) {
    return new SolareaLinkData(
      SolareaViewId.fromString(json._id),
      SolareaViewId.fromString(json.data),
      owners,
    );
  }

  return new SolareaViewData(
    SolareaViewId.fromString(json._id),
    json.type,
    Buffer.from(json.data, 'binary'),
    owners,
  );
}

export class RestStorageAdapter implements IStorageAdapter {
  restManager: RestStorageManager<SolareaViewData>;

  validateWallet() {
    if (!this.walletConnection.wallet || !this.walletConnection.connected) {
      this.walletConnection.select();
      return false;
    }
    if (!this.walletConnection.session) {
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

  get(id: SolareaViewId): Promise<SolareaViewData> {
    return this.restManager.get(id.id);
  }

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
