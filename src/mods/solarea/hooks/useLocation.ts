import React from "react";

history.pushState = function pushState() {
    History.prototype.pushState.apply(history, arguments);
    globalThis.removeAlluseCSSprop();
    window.dispatchEvent(new Event('pushState'));
};

export default function useLocation() {
    const [location, setLocation] = React.useState(window.location);

    const handleHashChange = React.useCallback(() => {
        // just window.location not worked
        setLocation(Object.assign({}, window.location));
    }, []);

    React.useEffect(() => {
        window.addEventListener("pushState", handleHashChange);
        window.addEventListener("popstate", handleHashChange);
        return () => {
            window.removeEventListener("pushState", handleHashChange)
            window.removeEventListener("popstate", handleHashChange)
        }
    }, [handleHashChange]);

    return location
}
