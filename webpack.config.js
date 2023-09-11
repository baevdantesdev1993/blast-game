const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
	const mode = argv.mode || 'development';
	return {
		entry: './src/index.ts',
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist'),
			clean: true,
		},
		devServer: {
			static: './dist',
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		module: {
			rules: [
				{
					test: /\.(?:js|mjs|cjs)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								['@babel/preset-env', {targets: 'defaults'}]
							]
						}
					}
				},
				{
					test: /\.(png|svg|jpg|jpeg|gif)$/i,
					type: 'asset/resource',
				},
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
			],
		},
		devtool: mode === 'development' ? 'source-map' : false,
		mode: mode,
		plugins: [
			new HtmlWebpackPlugin({
				template: 'src/index.html',
			}),
		],
	};
};
