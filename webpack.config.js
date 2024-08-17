// webpack.config.js

'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/js/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 5000,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader', // Injects styles into DOM
          'css-loader',   // Turns CSS into CommonJS
          {
            loader: 'postcss-loader', // PostCSS loader to process CSS with PostCSS
            options: {
              postcssOptions: {
                plugins: [autoprefixer]
              }
            }
          },
          'sass-loader'   // Compiles Sass to CSS
        ],
        include: path.resolve(__dirname, 'src')
      }
    ]
  },
  stats: {
    warnings: false // Disable all warnings
  }
};
