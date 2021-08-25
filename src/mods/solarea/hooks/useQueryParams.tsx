import useLocation from './useLocation';

export function getQueryParams(search) {
  const queryParams = search
    .slice(1)
    .split('&')
    .map((p) => p.split('=').map(decodeURIComponent));

  const query = {};
  for (let [key, value] of queryParams) {
    query[key] = value ?? null;
  }
  return query;
}

export default function useQueryParams(): { [name: string]: string } {
  const { search } = useLocation();
  return getQueryParams(search);
}
