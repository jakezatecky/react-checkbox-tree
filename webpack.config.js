const path = require('node:path');
const webpack = require('webpack');
const pkg = require('./package.json');

const banner = `
${pkg.name} - v${pkg.version}
Copyright (c) ${pkg.author}
Licensed under the ${pkg.license} License.
`;
const fileMap = {
    node: 'index.js',
    web: 'index.browser.js',
};

function makeConfig({ target }) {
    return {
        mode: 'none',
        target,
        entry: path.join(__dirname, 'src/index.js'),
        output: {
            path: path.join(__dirname, '/lib'),
            filename: fileMap[target],
            library: {
                name: 'ReactCheckboxTree',
                type: 'umd',
                umdNamedDefine: true,
            },
        },
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        externals: [
            {
                react: {
                    root: 'React',
                    commonjs2: 'react',
                    commonjs: 'react',
                    amd: 'react',
                },
            },
        ],
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules)/,
                    loader: 'babel-loader',
                },
            ],
        },
        plugins: [
            new webpack.BannerPlugin(banner.trim()),
        ],
    };
}

module.exports = makeConfig;
