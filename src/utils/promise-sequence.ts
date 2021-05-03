export const promiseSequence = (promiseFuncs: (() => Promise<any>)[]) =>
  promiseFuncs.reduce((p, promiseFunc) => {
    return p.then(promiseFunc);
  }, Promise.resolve());
//
// Promise.seq1 = promiseFuncs => {
//   if (!promiseFuncs.length) return Promise.resolve([]);
//   let prom = promiseFuncs[0]();
//   const res = [prom];
//   for (let i = 1; i < promiseFuncs.length; i++) {
//     prom = prom.then(promiseFuncs);
//     res.push(prom);
//   }
//   return prom.then(
//     () => res,
//     () => {
//       throw res;
//     },
//   ); // return results of promises
// };
//
// Promise.seqAll = promiseFuncs =>
//   promiseFuncs.reduce((p, promiseFunc) => {
//     promiseFuncs;
//     return p.then(
//       () => promiseFunc(),
//       () => promiseFunc(),
//     );
//   }, Promise.resolve());
