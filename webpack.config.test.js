const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('node:path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = {
    mode: 'development',
    entry: {
        index: path.join(__dirname, 'examples/src/index.jsx'),
        style: path.join(__dirname, 'examples/src/scss/style.scss'),
    },
    output: {
        path: path.join(__dirname, 'examples/dist'),
        filename: '[name].js',
        library: {
            name: 'ReactCheckboxTree',
            type: 'umd',
        },
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            'react-checkbox-tree': path.resolve(__dirname, 'src/index.js'),
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
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    devServer: {
        open: true,
        static: {
            directory: path.join(__dirname, 'examples/dist'),
        },
        watchFiles: ['src/**/*', 'examples/src/**/*'],
    },
    plugins: [
        new RemoveEmptyScriptsPlugin({}),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new HtmlWebpackPlugin({
            template: 'examples/src/index.html',
            filename: 'index.html',
            inject: false,
            minify: false,
        }),
    ],
};
