/* eslint-env node */
const {
    getBrowserWidth,
    getBrowserHeight,
    isDebugModeEnabled,
    getSlowModeDelay,
    // eslint-disable-next-line import/extensions -- we need this for resolution to work
} = require('./src/main/test/helpers/env-helper.js');

const debugMode = isDebugModeEnabled();
const headless = !debugMode;

module.exports = {
    launch: {
        headless,
        slowMo: debugMode ? getSlowModeDelay() : 0,
        devtools: debugMode,
        defaultViewport: {
            width: getBrowserWidth(),
            height: getBrowserHeight(),
        },
    },
};
