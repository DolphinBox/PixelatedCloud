let log = {
    info: (content) => {
        console.log('[PixelatedClouds BridgeAPI RN] [INFO] ' + content)
    },
    warn: (content) => {
        console.warn('[PixelatedClouds BridgeAPI RN] [WARN] ' + content)
    },
    error: (content) => {
        console.error('[PixelatedClouds BridgeAPI RN] [ERROR] ' + content)
    },
};

export default log;
