import useLocation from './useLocation';

export default function useQueryParams(): { [name: string]: string } {
  const queryParams = useLocation().search
    .slice(1)
    .split('&')
    .map(p => p.split('=').map(decodeURIComponent));
  const query = {};
  for (let [key, value] of queryParams) {
    query[key] = value ?? null;
  }
  return query;
}
