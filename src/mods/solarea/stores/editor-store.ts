import create from 'zustand';
import { mimeTypesData } from '../utils/mime-types-data';
import { SolareaViewId } from '../storage-adapters/SolareaViewId';
import { IStorageAdapter, SolareaLinkData, SolareaViewData } from '../storage-adapters/IStorageAdapter';

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
  file: { src: File | null; binary: Buffer };
  setFile: any;
  link: string;
  setLink: any;
  view: SolareaViewData | null;
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
  file: { src: null, binary: Buffer.from('') },
  setFile: doSet(set, 'file', (src, binary) => ({ src, binary })),
  // ----------------
  editorMaxWidth: 680,
  setEditorMaxWidth: doSet(set, 'editorMaxWidth'),
  // ------
  view: null,
  // ------
  initialCode: '',
  loadInitialCode: async (
    solanaStorage: IStorageAdapter,
    restStorage: IStorageAdapter,
    id: SolareaViewId,
  ) => {
    try {
      const [solSettle, restSettle] = await Promise.allSettled([
        solanaStorage.get(id),
        restStorage.get(id),
      ]);

      const viewData =
        (solSettle.status === 'fulfilled' && solSettle.value) ||
        (restSettle.status === 'fulfilled' && restSettle.value);

      if (!viewData) throw new Error('not_found');

      if (viewData.type === mimeTypesData['solarea/jsx']) {
        const code = viewData.data.toString('utf-8');
        set((state) => ({
          ...state,
          code,
          initialCode: code,
          view: viewData,
        }));
      } else if (viewData.type === mimeTypesData['solarea/link']) {
        const linkTo = (viewData as SolareaLinkData).linkTo;
        set((state) => ({
          ...state,
          link: linkTo.id,
          selectedContext: linkTo.context,
          name: linkTo.name,
        }));
      } else {
        const mimetype = mimeTypesData.getMime(viewData.type);
        return set((state) => ({
          ...state,
          file: {
            src: new File([viewData.data], 'file', { type: mimetype }),
            binary: viewData.data,
          },
          view: viewData,
        }));
      }
    } catch (e) {
      console.error(`error loading view ${id}`, e);
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
