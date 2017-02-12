module.exports = {
	output: {
		filename: 'index.js',
		libraryTarget: 'umd',
		library: 'ReactCheckboxTree',
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
