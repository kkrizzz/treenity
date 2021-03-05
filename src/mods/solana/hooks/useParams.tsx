const urlMatcher = /^https?:\/\/[\w.\d\-]+(:\d+)?\/([\w.\d\-]+)((\/([\w.\d\-]+)(\/([\w.\d\-]+))?)?(\?.*)?)?$/i;

export default function useParams() {
  const m = document.location.href.match(urlMatcher);
  // id, name, context, extra
  return m ? [m[2], m[5], m[7], m[8]] : [];
}
