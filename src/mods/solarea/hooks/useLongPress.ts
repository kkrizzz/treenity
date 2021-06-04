import { useState, useEffect, useCallback } from 'react';

export default function useLongPress(callback = (e) => {}, ms = 300) {
    const [startLongPress, setStartLongPress] = useState(false);
    const [event, setEvent] = useState<any>(null);

    function onMouseUpdate(e) {
        if(!event) return setStartLongPress(false);

        if(event.clientX !== e.clientX || event.clientY !== e.clientY) {
            setStartLongPress(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousemove', onMouseUpdate);
        let timerId;
        if (startLongPress) {
            timerId = setTimeout(() => {
                setStartLongPress(false);
                callback(event);
            }, ms);
        } else {
            clearTimeout(timerId);
        }

        return () => {
            document.removeEventListener('mousemove', onMouseUpdate)
            clearTimeout(timerId);
        };
    }, [callback, ms, startLongPress]);

    const start = useCallback((inst, evt) => {
        setEvent(evt)
        setStartLongPress(true);
    }, []);
    const stop = useCallback(() => {
        setEvent(null);
        setStartLongPress(false);
    }, []);

    return {
        onMouseOver: stop,
        onMouseOut: stop,
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
    };
}