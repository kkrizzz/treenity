import {useState} from "react";

export const useLocalStorageState = (key: string) => {
    const [state, setState] = useState<any>(localStorage.getItem(key))

    const setLocalState = (value: any) => {
        setState(value);
        localStorage.setItem(key, value);
    }

    return [state, setLocalState]
}