export const throttle = ( fn, delay ) => {
    let inThrottle = false;

    return args => {
        if (inThrottle) {
            return;
        }

        inThrottle = true;
        fn(args);
        setTimeout(() => {
            inThrottle = false;
        }, delay);
    };
};