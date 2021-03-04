import { MONGO_SERVICE_URL } from './config';
import {add} from "winston";

class MongoStorageManager {
  static async createView(view: object) {
    return fetch(MONGO_SERVICE_URL, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(view),
    });
  }

  static async patchView(_id, data) {
      const patched = await fetch(`${MONGO_SERVICE_URL}/${_id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      })
  }
  static async findView(address: string, name: string) {
    const viewData = await fetch(`${MONGO_SERVICE_URL}?address=${address}&name=${name}`);
    return await viewData.json();
  }
}


class SolanaStorageManager {
    static createView(view: object) {
    }
    static findView(address: string, name: string) {
    }
}

export default MongoStorageManager;


