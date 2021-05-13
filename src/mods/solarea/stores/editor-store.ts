import create from 'zustand';
import { restStorageManager } from '../rest-storage-manager';
import { makeId } from '../utils/make-id';
import { useQuery } from 'react-query';

interface IEditorStore {
  code: string;
  setCode: any;
  editorValue: string;
  setEditorValue: any;
  editorMaxWidth: number;
  setEditorMaxWidth: any;
  initialCode: string;
  loadInitialCode: any;
}

const useEditorStore = create<IEditorStore>((set) => ({
  editorMaxWidth: 680,
  setEditorMaxWidth: (newWidth) =>
    set((state) => ({
      ...state,
      editorMaxWidth: newWidth,
    })),
  // ------

  initialCode: '',
  loadInitialCode: async (id, name, context) => {
    const _id = makeId(id, name, context);
    try {
      const { data } = await restStorageManager.get(_id);
      return set((state) => ({
        ...state,
        initialCode: data,
      }));
    } catch (e) {
      console.log(`error loading view ${_id}`);
    }
  },
  // ---------

  editorValue: '',
  setEditorValue: (newValue) =>
    set((state) => ({
      ...state,
      editorValue: newValue,
    })),
  // ---------

  code: '',
  setCode: (newCode) =>
    set((state) => ({
      ...state,
      code: newCode,
    })),
}));

export default useEditorStore;
