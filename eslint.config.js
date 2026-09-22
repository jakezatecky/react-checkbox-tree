import takiyonConfig from 'eslint-config-takiyon-react';
import { createNodeResolver } from 'eslint-plugin-import-x';
import globals from 'globals';

import webpackConfig from './webpack.config.examples.js';

export default [
    ...takiyonConfig,
    {
        files: [
            '**/*.{js,jsx}',
        ],
        settings: {
            // Account for webpack.resolve.alias imports
            'import-x/resolver-next': [
                createNodeResolver({
                    alias: Object.fromEntries(
                        Object.entries(webpackConfig.resolve.alias).map(([name, target]) => [
                            name,
                            [target],
                        ]),
                    ),
                }),
            ],
        },
    },
    {
        // Front-end files
        files: [
            'examples/**/*.{js,jsx}',
            'src/**/*.{js,jsx}',
        ],
        languageOptions: {
            globals: globals.browser,
        },
    },
    {
        // Test files
        files: ['test/**/*.{js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.mocha,
            },
        },
    },
    {
        // Build files
        files: ['*.{js,jsx}'],
        languageOptions: {
            globals: globals.node,
        },
    },
];
