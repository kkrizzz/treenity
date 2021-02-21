import { randomString } from "../utils/randomString";

export function block({content, inputs = [], outputs = [], coordinates =  [0, 0], payload = {}}: any, ) {
    return {
        id: randomString(20),
        content,
        inputs,
        outputs,
        coordinates: coordinates,
        payload
    }
}
