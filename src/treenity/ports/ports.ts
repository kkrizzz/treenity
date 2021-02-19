import { EventEmitter } from 'eventemitter3';
import { Subject } from 'rxjs';


const messageEmitter = new EventEmitter();
//
// interface IInPort<T> {
//
// }
//
// export function registerInPort<T>(value, portName): IInPort<T> {
//
// }
//
// export function registerOutPort<T>(value, portName, enabler): () => void {
//   const onQuery = (query) => {
//
//   };
//   messageEmitter.on(`${value._id}_{portName}`, onQuery);
// }

export class ArrayInPort {
  type: string = 'in';
}

export class ArrayOutPort {
  type: string = 'out';
}
