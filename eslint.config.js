import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import reactHooks from 'eslint-plugin-react-hooks';
import parser from '@babel/eslint-parser';
import globals from 'globals';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: ['node_modules/*', 'target/*', 'atlassian/*', 'static/*'],
    },
    ...fixupConfigRules(
        compat.extends('airbnb', 'plugin:prettier/recommended', 'plugin:react/recommended')
    ),
    {
        plugins: {
            'react-hooks': fixupPluginRules(reactHooks),
        },

        languageOptions: {
            parser,
            globals: {
                ...globals.browser,
            },
            ecmaVersion: 7,
            sourceType: 'module',

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },

                jsx: true,
            },
        },

        settings: {
            react: {
                version: 'detect',
            },
        },

        rules: {
            'import/extensions': 'off',
            'import/no-named-as-default': 'off',
            'import/no-named-as-default-member': 'off',
            'import/no-webpack-loader-syntax': 'off',
            'import/prefer-default-export': 'off',
            'prettier/prettier': 'error',
            'react/jsx-boolean-value': 0,
            'react/jsx-filename-extension': 0,
            'react/jsx-fragments': ['error', 'syntax'],

            'react/jsx-max-depth': [
                1,
                {
                    max: 4,
                },
            ],

            'react/jsx-no-useless-fragment': 'error',
            'react/jsx-props-no-spreading': 0,
            'no-shadow': 'warn',
            'react/require-default-props': 'warn',
            'no-console': 'off',
            'no-undef': 'warn',
            'no-param-reassign': 'warn',
            'react/destructuring-assignment': 'warn',
            'import/no-extraneous-dependencies': 'warn',
            'jsx-a11y/label-has-associated-control': 'warn',
            'no-return-assign': 'warn',
            'react/static-property-placement': 'warn',
            'react/sort-comp': 'warn',
            'class-methods-use-this': 'warn',
            'react/state-in-constructor': 'warn',
            'consistent-return': 'warn',
            'react/no-access-state-in-setstate': 'warn',
            radix: 'warn',
            'react/no-did-update-set-state': 'warn',
            'import/no-cycle': 'warn',
            'import/named': 'warn',
            'no-prototype-builtins': 'warn',
            'import/order': 'warn',
            'no-unused-expressions': 'warn',
            'import/no-unresolved': 'warn',
            'react/forbid-component-props': 'warn',
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
        },
    },
    {
        files: ['config/*', '*.js'],

        languageOptions: {
            globals: {
                ...globals.node,
            },
        },

        rules: {
            'import/no-extraneous-dependencies': 'off',
        },
    },
    {
        files: ['src/main/test/**', '**/*.test.js'],

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
                ...globals.jasmine,
            },
        },
        rules: {
            'import/extensions': ['error', 'ignorePackages'],
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
            'no-console': 'off',
        },
    },
];
