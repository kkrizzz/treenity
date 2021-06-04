export function promised() {
  let resolve,
    reject;
  const prom = new Promise((resv, rej) => {
    resolve = resv;
    reject = rej;
  });
  if (!resolve) throw new Error('promise not yet run');
  prom.resolve = resolve;
  prom.reject = reject;
  return prom;
}
