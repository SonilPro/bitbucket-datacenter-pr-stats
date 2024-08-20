import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { I18N_FILES } from './webpack-constants.js';

function getLoaders({ isProductionEnv = false }) {
    return [
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: '@atlassian/i18n-properties-loader',
                    options: {
                        i18nFiles: I18N_FILES,
                        disabled: isProductionEnv,
                    },
                },
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                },
            ],
        },

        {
            test: /\.css$/,
            use: [
                {
                    loader: isProductionEnv ? MiniCssExtractPlugin.loader : 'style-loader',
                },

                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    },
                },
            ],
        },

        {
            test: /\.less$/,
            use: [
                {
                    loader: isProductionEnv ? MiniCssExtractPlugin.loader : 'style-loader',
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    },
                },
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                    },
                },
            ],
        },

        {
            test: /\.(png|jpg|gif|svg)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {},
                },
            ],
        },

        {
            test: /\.soy$/,
            use: [
                {
                    loader: '@atlassian/i18n-properties-loader',
                    options: {
                        I18N_FILES,
                        disabled: isProductionEnv,
                    },
                },

                {
                    loader: '@atlassian/soy-loader',
                    options: {
                        dontExpose: true,
                    },
                },
            ],
        },

        {
            test: /\.cse.graphql$/,
            loader: '@atlassian/clientside-extensions-schema/loader',
        },
    ];
}

export const loaders = (isProduction) => getLoaders(isProduction);
