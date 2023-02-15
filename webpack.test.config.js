const path = require('node:path');

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
        ],
    },
};
