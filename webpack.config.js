 var path = require('path');
 var webpack = require('webpack');

 module.exports = {
    entry: {
        twitch: './src/assets/js/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js'
    },
    module: {
         loaders: [
            {
                exclude: /node_modules/,
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
 };
