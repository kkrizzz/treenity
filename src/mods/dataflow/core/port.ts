import { randomString } from "../utils/randomString";
import { typeEnum } from "../types/Port";
import {randomId} from "../../../common/random-id";

export const port = (direction: 'out' | 'in', label: string, type: string, id = randomId()) => {
    return {
        alignment: direction==="in"?'left':'right',
        label,
        type,
        id,
    }
}