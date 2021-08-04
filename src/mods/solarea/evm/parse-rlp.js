import * as Rlp from 'rlp';

export function parseRlp(data) {
  const rlp = Rlp;
  const result = rlp.decode(data);
  return result;
}
