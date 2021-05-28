import create from 'zustand';
import { restStorageManager } from '../rest-storage-manager';
import { makeId } from '../utils/make-id';
import { useQuery } from 'react-query';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { createViewAddress } from '../program-api/solarea-program-api';
import { solareaApi } from '../client';
import { mimeTypesData } from '../utils/mime-types-data';
import { addComponent } from '../component-db';
import { resolveViewByMime } from '../components/Files/Resolver';

const doSet = (set, name: string, transform = (...x) => x[0]) => (...values) =>
  set((state) => ({
    ...state,
    [name]: transform(...values),
  }));
const doToggle = (set, name: string) => (value) =>
  set((state) => ({
    ...state,
    [name]: !value,
  }));

interface IEditorStore {
  code: string;
  setCode: any;
  editorValue: string;
  setEditorValue: any;
  editorMaxWidth: number;
  setEditorMaxWidth: any;
  initialCode: string;
  loadInitialCode: any;
  file: { src: File | null; binary: string };
  setFile: any;
  link: string;
  setLink: any;
  view: { _id: string; fromMongo: boolean | undefined } | null;
  selectedContext: string;
  setSelectedContext: any;
  showHotkeys: boolean;
  toggleShowHotkeys: any;
  setCurrentAddress;
}

const useEditorStore = create<IEditorStore>((set) => ({
  showHotkeys: false,
  toggleShowHotkeys: doToggle(set, 'showHotkeys'),
  selectedContext: 'react',
  setSelectedContext: doSet(set, 'selectedContext'),
  link: '',
  setLink: doSet(set, 'link'),
  file: { src: null, binary: '' },
  setFile: doSet(set, 'file', (src, binary) => ({ src, binary })),
  // ----------------
  editorMaxWidth: 680,
  setEditorMaxWidth: doSet(set, 'editorMaxWidth'),
  // ------
  view: null,
  // ------
  initialCode: '',
  loadInitialCode: async (id, name, context) => {
    const _id = makeId(id, name, context);
    try {
      const url = clusterApiUrl('devnet');
      const connection = new Connection(url);

      const viewAddress = id.length > 32 ? new PublicKey(id).toBuffer() : id;
      const [storageAddress] = createViewAddress(viewAddress, context, name);

      const [solSettle, restSettle] = await Promise.allSettled([
        connection.getAccountInfo(storageAddress),
        restStorageManager.get(_id),
      ]);

      let viewData;
      let viewLink;

      if (solSettle.status === 'fulfilled' && solSettle.value) {
        const { data, type } = solareaApi.unpackData(solSettle.value.data);
        const dataToUtf8 = data.toString('utf-8');

        const mimetype = mimeTypesData.getData(type);

        if (mimetype) {
          const binaryStr = data.toString('binary');
          const array: Array<number> = [];
          for (let i = 0; i < binaryStr.length; i++) {
            array.push(binaryStr.charCodeAt(i));
          }
          return set((state) => ({
            ...state,
            file: {
              src: new File([new Uint8Array(array)], 'file', { type: mimetype }),
              binary: binaryStr,
            },
            view: { hasFile: true, fromMongo: false, _id },
          }));
        }

        if (dataToUtf8.includes('~')) {
          viewLink = dataToUtf8;
        } else {
          viewData = dataToUtf8;
        }
      } else if (restSettle.status === 'fulfilled') {
        viewData = restSettle.value!.data;
        viewLink = restSettle.value!.link;
      } else {
        throw new Error();
      }

      return set((state) => ({
        ...state,
        initialCode: viewData,
        link: viewLink,
        view: {
          _id,
          fromMongo: solSettle.status !== 'fulfilled' || solSettle.value === null,
          hasFile: false,
        },
      }));
    } catch (e) {
      console.log(`error loading view ${_id}`, e.code);
    }
  },
  // ---------

  editorValue: '',
  setEditorValue: doSet(set, 'editorValue'),
  // ---------

  code: '',
  setCode: doSet(set, 'code'),

  currentAddress: '',
  setCurrentAddress: doSet(set, 'currentAddress'),
}));

export const useEditorSelect = (...names) =>
  useEditorStore((state) => names.map((name) => state[name]));

export default useEditorStore;
