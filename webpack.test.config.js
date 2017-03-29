const path = require('path');

module.exports = {
	output: {
		filename: 'index.js',
		libraryTarget: 'umd',
		library: 'ReactCheckboxTree',
	},
	resolve: {
		alias: {
			'react-checkbox-tree': path.resolve(__dirname, 'src/js/CheckboxTree'),
		},
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components|vender_modules)/,
				loader: 'babel-loader',
			},
		],
	},
};
