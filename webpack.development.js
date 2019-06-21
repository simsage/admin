const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const stylesheetsLoaders = [{
    loader: 'css-loader',
    options: {
        modules: true,
        localIdentName: '[path]-[local]-[hash:base64:3]',
        sourceMap: true
    }
}
];

const stylesheetsPlugin = new ExtractTextPlugin('[hash].css');
const definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'development' || 'false')),
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
    }
});
const compressionPlugin = new CompressionPlugin();

module.exports = {
    context: path.join(__dirname, 'app'),
    entry: path.join(__dirname, 'app', 'app.js'),
    watch: false,
    devtool: "true",
    output: {
        publicPath: '/',
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    mode: process.env.NODE_ENV || 'development',
    resolve: {
        modules: [path.resolve(__dirname, 'app'), 'node_modules']
    },
    plugins: [
        stylesheetsPlugin,
        new HtmlWebpackPlugin({template: path.join(__dirname, 'app', 'index.html')}),
        definePlugin,
        compressionPlugin,
        new CopyWebpackPlugin([
            {
                from: 'images',
                to: 'images'
            },
            {
                from: 'css',
                to: 'css'
            },
            {from: 'favicon.ico'}
        ])
    ],
    module: {
        rules: [{
            test: /\.js$/, // include .js files
            include: [
                path.resolve(__dirname, "app")
            ],
            // enforce: "pre", // preload the loader
            exclude: /node_modules/, // exclude any and all files in the node_modules folder
            loader: "babel-loader",
            options: {
                presets: ["react", "stage-0", "es2015"]
            },
        }]
    }};
