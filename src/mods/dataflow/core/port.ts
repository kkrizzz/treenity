import { randomString } from "../utils/randomString";
import { typeEnum } from "../types/Port";

export const port = (direction: 'out' | 'in', label: string, type: typeEnum) => {
    return {
        id: randomString(20),
        alignment: direction==="in"?'left':'right',
        label,
        type
    }
}