import React from "react";

history.pushState = function pushState() {
    History.prototype.pushState.apply(history, arguments);
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
        return () => window.removeEventListener("pushState", handleHashChange);
    }, [handleHashChange]);

    return location
}
