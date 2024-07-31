import { join, resolve } from 'path';

const paths = {
    mocksRoot: resolve('./src/mocks'),
    testsRoot: resolve('./src/main/my-app/'),
};

export default {
    clearMocks: true,
    verbose: true,
    transform: {
        '\\.jsx?$': 'babel-jest',
    },
    roots: [paths.testsRoot],
    moduleFileExtensions: ['js', 'jsx', 'json'],
    transformIgnorePatterns: ['node_modules/(?!(@atlassian/clientside-[^/]+))/'],
    moduleNameMapper: {
        '^wrm/i18n$': join(paths.mocksRoot, './wrm/i18n.js'),
        '^wrm/context-path$': join(paths.mocksRoot, './wrm/context-path.js'),
        '^@atlassian/wrm-react-i18n$': join(paths.mocksRoot, './@atlassian/wrm-react-i18n.js'),
        '\\.(css|less)$': 'identity-obj-proxy',
    },
    testEnvironment: 'jsdom',
    testMatch: ['**/__tests__/**/*.+(js|jsx)', '**/?(*.)+(spec|test).+(js|jsx)'],
};
