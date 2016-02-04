/* eslint-disable */

var webpack = require('webpack');

module.exports = {
	output: {
		filename: 'react-checkbox-tree.js',
		libraryTarget: 'umd',
		library: 'ReactCheckboxTree',
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
