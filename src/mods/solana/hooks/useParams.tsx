import React from 'react';
import useLocation from "./useLocation";

const urlMatcher = /^https?:\/\/[\w.\d\-]+(:\d+)?\/([\w.\d\-]+)((\/([\w.\d\-]+)(\/([\w.\d\-]+))?)?(\?.*)?)?$/i;

export default function useParams() {
  const location = useLocation();

  const m = location.match(urlMatcher);
  // id, name, context, extra
  return m ? [m[2], m[5], m[7], m[8]] : [];
}
