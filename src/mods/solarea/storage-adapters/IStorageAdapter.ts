interface IViewData {
  id: string;
  type: number;
  data: string;
  link: string;
  owner?: string | string[];
}

export interface IStorageAdapter {
  get(id: string): Promise<IViewData>;
  patch(): Promise<IViewData>;
  remove(): Promise<void>;
}
