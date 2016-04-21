/* eslint-disable */

module.exports = {
	output: {
		filename: 'index.js',
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
