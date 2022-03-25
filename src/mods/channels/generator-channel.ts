import { chan, go, put, Channel } from 'js-csp';

export function genChan(gen: Generator) {
  return intoGen(gen);
}

export function intoGen(gen: Generator, ch?: Channel) {
  ch = ch || chan();
  let l;
  go(function* () {
    while (!(l = gen.next()).done) {
      yield put(ch, l.value);
    }
    ch.close();
  });

  return ch;
}
