import React from "react";

history.pushState = function pushState(...args) {
    History.prototype.pushState.apply(history, args);
    window.dispatchEvent(new Event('pushState'));
};

export default function useLocation() {
    const [location, setLocation] = React.useState(window.location);

    const handleHashChange = React.useCallback(() => {
        setLocation(window.location);
    }, []);

    React.useEffect(() => {
        window.addEventListener("pushState", handleHashChange);
        return () => window.removeEventListener("pushState", handleHashChange);
    }, [handleHashChange]);

    return location;
}
