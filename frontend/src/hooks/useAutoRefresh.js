import { useEffect, useRef } from 'react';

/**
 * Calls `callback` immediately and then every `intervalMs` milliseconds.
 * Cleans up on unmount.
 */
const useAutoRefresh = (callback, intervalMs = 15000, enabled = true) => {
    const savedCallback = useRef(callback);
    useEffect(() => { savedCallback.current = callback; }, [callback]);

    useEffect(() => {
        if (!enabled) return;
        savedCallback.current();
        const id = setInterval(() => savedCallback.current(), intervalMs);
        return () => clearInterval(id);
    }, [intervalMs, enabled]);
};

export default useAutoRefresh;
