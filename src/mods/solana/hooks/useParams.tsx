import bs58 from 'bs58';
import useLocation from './useLocation';

// match url of format: [subdomain].domain.com/[id]/[name]/[context]
const part = '\/([\\w\\d\\-:\\.]+)'; // '/
const urlMatcher = new RegExp(`^https?:\/${part}(:\\d+)?${part}((${part}(${part})?)?(\\?.*)?)?$`, 'i');

const DEFAULT = 'default';
const TRANSACTION = 'transaction';
const REACT = 'react';

export default function useParams() {
  const location = useLocation();

  const m = location.href.match(urlMatcher);
  const names = location.hostname.split('.');
  // id, name, context, extra
  const result = m ? [m[3], m[6] || DEFAULT, m[8] || REACT, m[9]] : ['root', DEFAULT, REACT];
  if (names.length === 3) { // add subdomain as address here
    result.unshift(names[0]);
  }

  const id = result[0];
  if (id && !result[2] && id.length === 88 && bs58.decodeUnsafe(id)?.length === 64) {
    result[2] = TRANSACTION;
  }

  return result;
}
