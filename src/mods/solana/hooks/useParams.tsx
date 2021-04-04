import useLocation from './useLocation';

// match url of format: [subdomain].domain.com/[id]/[name]/[context]
// const part = '/([\\w\\d\\-:\\.]+)'; // '/
// const urlMatcher = new RegExp(
//   `^http?:\/${part}(:\\d+)?${part}((${part}(${part})?)?(\\?.*)?)?$`,
//   'i'
// );
// const TRANSACTION = 'transaction';

const DEFAULT = 'default';
const REACT = 'react';

export default function useParams() {
  const location = useLocation();

  const names = location.hostname.split('.');
  const paths = location.pathname.split('/').filter((i) => !!i);
  const hasSubdomain = names.length === 3; // 2 - localhost 3 - .domen

  let addr, name, context;

  if (hasSubdomain) {
    addr = names[0];
    name = paths[0];
    context = paths[1];
  } else {
    addr = paths[0];
    name = paths[1];
    context = paths[2];
  }
  return [addr || 'root', name || DEFAULT, context || REACT]
}
