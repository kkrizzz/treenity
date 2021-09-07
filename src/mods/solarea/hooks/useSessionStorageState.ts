import { createStorageState } from './useLocalStorageState';

export const useSessionStorageState = createStorageState(window.sessionStorage, 'session');
