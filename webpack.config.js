/* eslint-disable */

var webpack = require('webpack');

module.exports = {
	output: {
		filename: 'index.js',
		libraryTarget: 'umd',
		library: 'ReactCheckboxTree',
	},
	externals: {
		react: 'React',
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components|vender_modules)/,
				loader: 'babel',
				query: {
					presets: ['react', 'es2015', 'stage-0']
				},
			},
		],
	},
};
