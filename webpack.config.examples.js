import HtmlBundlerPlugin from 'html-bundler-webpack-plugin';
import path from 'node:path';

const { dirname } = import.meta;

export default {
    mode: 'development',
    entry: {
        index: path.join(dirname, 'examples/src/index.jsx'),
        style: path.join(dirname, 'examples/src/scss/style.scss'),
    },
    output: {
        path: path.join(dirname, 'examples/dist'),
        library: {
            name: 'ReactCheckboxTree',
            type: 'umd',
        },
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            'react-checkbox-tree': path.resolve(dirname, 'src/index.js'),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    devServer: {
        open: true,
        static: {
            directory: path.join(dirname, 'examples/dist'),
        },
        watchFiles: ['src/**/*', 'examples/src/**/*'],
    },
    plugins: [
        new HtmlBundlerPlugin({
            entry: {
                index: 'examples/src/index.html',
            },
            js: {
                filename: '[name].[contenthash:8].js',
            },
            css: {
                filename: '[name].[contenthash:8].css',
            },
        }),
    ],
};
