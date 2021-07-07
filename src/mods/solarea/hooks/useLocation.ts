import { useState, useCallback, useEffect } from 'react';

history.pushState = function pushState() {
  History.prototype.pushState.apply(history, arguments);
  if (arguments[4]) globalThis.removeAlluseCSSprop();
  window.dispatchEvent(new Event('pushState'));
};

export default function useLocation() {
  const [location, setLocation] = useState(window.location);

  const handleHashChange = useCallback(() => {
    // just window.location not worked
    setLocation(Object.assign({}, window.location));
  }, []);

  useEffect(() => {
    window.addEventListener('pushState', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('pushState', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [handleHashChange]);

  return location;
}
