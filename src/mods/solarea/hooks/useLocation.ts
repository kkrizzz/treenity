import { useState, useCallback, useEffect } from 'preact';

history.pushState = function pushState(data, title, url) {
  History.prototype.pushState.call(history, data, title, url);
  window.dispatchEvent(new Event('pushState'));
};
history.replaceState = function replaceState(data, title, url) {
  History.prototype.replaceState.call(history, data, title, url);
  window.dispatchEvent(new Event('pushState'));
};

export default function useLocation() {
  const [, setCounter] = useState(0);

  useEffect(() => {
    const handleHashChange = () => setCounter((n) => n + 1);
    window.addEventListener('pushState', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('pushState', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [setCounter]);

  return window.location;
}
