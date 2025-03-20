const isProduction = () => {
    return process.env.IS_PROD === 'true';
};

const serverLogger = {
    log: (...args) => {
        if (!isProduction()) {
            console.log(...args);
        }
    },
    warn: (...args) => {
        if (!isProduction()) {
            console.warn(...args);
        }
    },
    error: (...args) => {
        console.error(...args);
    },
};

export default serverLogger;