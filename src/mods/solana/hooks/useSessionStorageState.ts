import {useState} from "react";

export const useSessionStorageState = (key: string) => {
    const [state, setState] = useState<any>(sessionStorage.getItem(key))

    const setSessionState = (value: any) => {
        setState(value);
        sessionStorage.setItem(key, value);
    }

    return [state, setSessionState]
}