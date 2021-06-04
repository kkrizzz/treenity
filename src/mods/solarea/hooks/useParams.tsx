import useLocation from './useLocation';

const DEFAULT = 'default';
const REACT = 'react';

export default function useParams() {
  const location = useLocation();

  const names = location.hostname.split('.').reverse();
  const paths = location.pathname.split('/').filter((i) => !!i);

  let addr, name, context;

  // has 2 or more subdomains
  if (names.length >= 4) {
    let first, second;
    [first, second, addr, context] = names;
    addr = `${second}.${first}`;
    context = paths[0];
    // has one subdomain
  } else if (names[0] === 'work' && names[1] === 'medianet') {
    addr = paths[0] || names.join('.');
    name = paths[1];
    context = paths[2];
  } else if (names.length === 3) {
    addr = names[2];
    name = paths[0];
    context = paths[1];
    // just domain name - 'meta.store'
  } else if (paths.length === 0) {
    addr = `${names[1]}.${names[0]}`;
    // url site.name/addr/name/context - address with name in context
  } else {
    addr = paths[0];
    name = paths[1];
    context = paths[2];
  }
  // some defaults if needed
  return [addr, name || DEFAULT, context || REACT];
}
