var webpack = require("webpack");

module.exports = {
    entry: "./index.jsx",
    output: {
        path: __dirname,
        filename: "build.js"
    },
    module: {
        loaders: [
            {
				test: /\.jsx?$/, 
				exclude: /node_modules/, 
				loader: "babel-loader"
			}
        ]
    },
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				MESSAGES_WEBSOCKET_SERVICE_HOST: JSON.stringify(process.env.MESSAGES_WEBSOCKET_SERVICE_HOST),
				MESSAGES_WEBSOCKET_SERVICE_PORT: JSON.stringify(process.env.MESSAGES_WEBSOCKET_SERVICE_PORT),
				MESSAGES_REST_SERVICE_HOST: JSON.stringify(process.env.MESSAGES_REST_SERVICE_HOST),
				MESSAGES_REST_SERVICE_PORT: JSON.stringify(process.env.MESSAGES_REST_SERVICE_PORT)
			}
		})
	]
};