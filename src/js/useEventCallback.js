import { useCallback, useEffect, useRef } from 'react';

/**
 * Get a callback with a stable identity that always invokes the most recently rendered `callback`.
 *
 * This allows handlers to read the latest props and state without invalidating memoized children
 * each time those change.
 */
function useEventCallback(callback) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    });

    return useCallback((...args) => callbackRef.current(...args), []);
}

export default useEventCallback;
