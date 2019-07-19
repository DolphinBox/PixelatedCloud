let log = {
    info: (content) => {
        console.log('[PixelatedClouds BridgeAPI Node] [INFO] ' + content)
    },
    warn: (content) => {
        console.warn('[PixelatedClouds BridgeAPI Node] [WARN] ' + content)
    },
    error: (content) => {
        console.error('[PixelatedClouds BridgeAPI Node] [ERROR] ' + content)
    },
};

module.exports = log;
