const path = require('node:path');
const webpack = require('webpack');
const pkg = require('./package.json');

const banner = `${pkg.name} - v${pkg.version} | ${(new Date()).getFullYear()}`;

function makeConfig({ target }) {
    const fileMap = {
        node: 'index.js',
        web: 'index.browser.js',
    };

    return {
        mode: 'production',
        target,
        entry: path.join(__dirname, 'src/index.js'),
        output: {
            path: path.join(__dirname, '/lib'),
            filename: fileMap[target],
            library: {
                name: 'ReactCheckboxTree',
                type: 'umd',
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
            {
                'react-dom': {
                    root: 'ReactDOM',
                    commonjs2: 'react-dom',
                    commonjs: 'react-dom',
                    amd: 'react-dom',
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
            new webpack.BannerPlugin(banner),
        ],
    };
}

module.exports = makeConfig;
