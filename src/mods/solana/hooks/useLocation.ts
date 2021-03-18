import React from "react";

history.pushState = function()
{
    History.prototype.pushState.apply(history, arguments);
    window.dispatchEvent(new Event('pushState'))
}

export default function useLocation() {
    const [location, setLocation] = React.useState(window.location.href);

    const handleHashChange = React.useCallback(() => {
        setLocation(window.location.href);
    }, []);

    React.useEffect(() => {
        window.addEventListener("pushState", handleHashChange);
        return () => window.removeEventListener("pushState", handleHashChange);
    }, [handleHashChange]);

    return location;
}