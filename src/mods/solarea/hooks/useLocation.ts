import { useState, useCallback, useEffect } from 'react';

history.pushState = function pushState(data, title, url) {
  History.prototype.pushState.call(history, data, title, url);
  window.dispatchEvent(new Event('pushState'));
};
history.replaceState = function replaceState(data, title, url) {
  History.prototype.replaceState.call(history, data, title, url);
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
