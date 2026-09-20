import takiyonConfig from 'eslint-config-takiyon-react';
import globals from 'globals';

import webpackConfig from './webpack.config.examples.js';

// Resolve issue with HTML Webpack Bundler causing circular references
// https://github.com/webdiscus/html-bundler-webpack-plugin/issues/186
delete webpackConfig.plugins;

export default [
    ...takiyonConfig,
    {
        files: [
            '**/*.{js,jsx}',
        ],
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
