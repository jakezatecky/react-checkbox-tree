import takiyonConfig from 'eslint-config-takiyon-react';
import globals from 'globals';

import webpackConfig from './webpack.config.examples.js';

export default [
    ...takiyonConfig,
    {
        files: [
            '**/*.{js,jsx}',
        ],
        ignores: ['./node_modules/**/*'],
        settings: {
            // Account for webpack.resolve.module imports
            'import/resolver': {
                webpack: {
                    config: webpackConfig,
                },
            },
        },
    },
    {
        // Front-end files
        files: [
            'examples/**/*.{js,jsx}',
            'src/**/*.{js,jsx}',
        ],
        languageOptions: {
            globals: {
                APP_NAME: 'readonly',
                ...globals.browser,
            },
        },
    },
    {
        // Test files
        files: ['test/**/*.{js,jsx}'],
        languageOptions: {
            globals: {
                APP_NAME: 'readonly',
                ...globals.browser,
                ...globals.mocha,
            },
        },
    },
    {
        // Build files
        files: ['*.{js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
];
