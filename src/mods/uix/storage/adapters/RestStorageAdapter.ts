import memoize from 'lodash.memoize';
import {
  IGetStorageOptions,
  IStorageAdapter,
  SolareaLinkData,
  SolareaViewData,
} from './IStorageAdapter';
import RestStorageManager from './rest-storage-manager';
import { mimeTypesData } from '../../utils/mime-types-data';
// import { SolareaViewId } from '../../../solarea/storage-adapters/SolareaViewId';
// import { loadQueryFromComponent } from '../../../solarea/editor/NewEditor/graphql-editor/api';
// import IComponentQuery from '../../../solarea/editor/NewEditor/types/IComponentQuery';
// import { urlToAddressContext } from '../../../solarea/hooks/useParams';

interface Entry {
  _id: string;
  data: string;
  type: number;
  owner?: string[];
}

function jsonToViewData(json: Entry): SolareaViewData {
  const owners = undefined; //json.owner?.map((owner) => new PublicKey(owner));

  const data =
    json.type === mimeTypesData['solarea/link']
      ? new SolareaLinkData(json._id, json.data, owners)
      : new SolareaViewData(json._id, json.type, Buffer.from(json.data, 'utf-8'), owners);
  data.dataSource = 'rest';
  return data;
}

export class RestStorageAdapter implements IStorageAdapter {
  restManager: RestStorageManager<SolareaViewData>;

  constructor(baseUrl: string, private session: string = '') {
    this.restManager = new RestStorageManager<SolareaViewData>(baseUrl, session, jsonToViewData);
  }

  _loadView(url: string): Promise<SolareaViewData> {
    console.log('loadView', url);
    return this.restManager.get(new URL(url).pathname);
  }

  get = memoize(
    async (url: string, opts?: IGetStorageOptions): Promise<SolareaViewData> => {
      let viewData = await this._loadView(url);
      if (opts?.resolveLinks) {
        while (viewData.type === mimeTypesData['solarea/link']) {
          viewData = await this._loadView((viewData as SolareaLinkData).linkTo);
        }
      }
      // if (viewData) viewData.queries = queries;
      return viewData;
    },
    (id, opts) => `${id}${opts?.resolveLinks}`,
  );

  async remove(url: string): Promise<void> {
    await this.restManager.remove(url);
  }

  async save(data: SolareaViewData): Promise<void> {
    // if (!this.validateWallet()) return;

    const obj = await this.get(data.url).catch(() => null);
    if (obj) {
      await this.restManager.patch(data.url, data);
    } else {
      await this.restManager.create(data);
    }
  }
}

export class SolRestStorageAdapter extends RestStorageAdapter {
  _loadView(url: string): Promise<SolareaViewData> {
    const [id, name = 'default', context = 'react'] = new URL(url).pathname.split('/');
    url = `${id}~${context}~${name}`;
    console.log('loadView 1', url);

    return this.restManager.get(url);
  }
}

// export const RestStorageContext = createContext<RestStorageAdapter | null>(null);

// export function useRestStorage(): RestStorageAdapter {
//   const adapter = useContext(RestStorageContext);
//   if (!adapter) throw new Error('Rest storage adapter not present in context');
//
//   return adapter;
// }
