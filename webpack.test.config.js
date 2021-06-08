const path = require('path');

module.exports = {
    mode: 'development',
    output: {
        filename: 'index.js',
        library: {
            name: 'ReactCheckboxTree',
            type: 'umd',
        },
    },
    resolve: {
        alias: {
            'react-checkbox-tree': path.resolve(__dirname, 'src/index.js'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
            },
        ],
    },
};
