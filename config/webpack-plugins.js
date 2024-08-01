import WrmPlugin from 'atlassian-webresource-webpack-plugin';
import { PLUGIN_KEY, WRM_OUTPUT, PROVIDED_DEPENDENCIES } from './webpack-constants.js';

const plugins = (shouldWatch) => [
    new WrmPlugin({
        pluginKey: PLUGIN_KEY,
        xmlDescriptors: WRM_OUTPUT,
        providedDependencies: PROVIDED_DEPENDENCIES,
        watch: shouldWatch,
        watchPrepare: shouldWatch,
    }),
];

export default plugins;
