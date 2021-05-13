import create from 'zustand';

interface IEditorStore {
  code: string;
  setCode: any;
  editorValue: string;
  setEditorValue: any;
  editorMaxWidth: number;
  setEditorMaxWidth: any;
}

const useEditorStore = create<IEditorStore>((set) => ({
  editorMaxWidth: 680,
  setEditorMaxWidth: (newWidth) =>
    set((state) => ({
      ...state,
      editorMaxWidth: newWidth,
    })),

  editorValue: '',
  setEditorValue: (newValue) =>
    set((state) => ({
      ...state,
      editorValue: newValue,
    })),

  code: '',
  setCode: (newCode) =>
    set((state) => ({
      ...state,
      code: newCode,
    })),
}));

export default useEditorStore;
