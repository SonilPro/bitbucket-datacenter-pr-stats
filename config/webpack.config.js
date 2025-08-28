import TerserPlugin from 'terser-webpack-plugin';
import { merge } from 'webpack-merge';
import ClientsideExtensionWebpackPlugin from '@atlassian/clientside-extensions-webpack-plugin';
import webpack from 'webpack';

import {
    DEV_SERVER_HOST,
    DEV_SERVER_PORT,
    FRONTEND_OUTPUT_DIR,
    FRONTEND_SRC_DIR,
} from './webpack-constants.js';

import plugins from './webpack-plugins.js';
import { loaders } from './webpack-loaders.js';

const clientsideExtensions = new ClientsideExtensionWebpackPlugin({
    cwd: FRONTEND_SRC_DIR,
    pattern: 'extensions/**/*-{extension,page}.js*',
});

const watchConfig = {
    devServer: {
        host: DEV_SERVER_HOST,
        port: DEV_SERVER_PORT,
        allowedHosts: 'auto',
        client: {
            overlay: {
                errors: false,
                warnings: false,
                runtimeErrors: false,
            },
            progress: true,
        },
        compress: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
        },
        hot: false,
        liveReload: true,
    },
};

const devConfig = (env) => {
    return merge([
        {
            optimization: {
                minimize: false,
            },
            output: {
                publicPath: `http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}/`,
                filename: '[name].js',
                chunkFilename: '[name].chunk.js',
            },
            devtool: false,
        },
        Boolean(env['dev-server']) && watchConfig,
    ]);
};

const prodConfig = {
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: {
                        reserved: ['I18n', 'getText'],
                    },
                },
            }),
        ],
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
    },

    devtool: 'source-map',
};

export default (env, argv = {}) => {
    const isProduction = argv.mode !== 'development';
    const modeConfig = isProduction ? prodConfig : devConfig(env);

    return merge([
        {
            mode: argv.mode,

            entry: {
                ...clientsideExtensions.generateEntrypoints(),
            },

            resolve: {
                extensions: ['.js', '.jsx'],
            },

            stats: {
                logging: 'info',
            },

            context: FRONTEND_SRC_DIR,
            plugins: [
                ...plugins(!isProduction),
                clientsideExtensions,
                new webpack.DefinePlugin({
                    'module.hot': 'false',
                }),
            ],

            optimization: {
                splitChunks: {
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            chunks: 'all',
                            name: 'vendor',
                            enforce: true,
                        },
                    },
                },

                runtimeChunk: {
                    name: 'vendor',
                },
            },

            module: {
                rules: loaders(isProduction),
            },

            output: {
                path: FRONTEND_OUTPUT_DIR,
            },
        },
        modeConfig,
    ]);
};
