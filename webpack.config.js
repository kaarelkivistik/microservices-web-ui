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
    }
};