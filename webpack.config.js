const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = {
       entry: './src/main.ts',
       target: 'node',
       mode: 'production',
       output: {
              path: path.resolve(__dirname, 'dist'),
              filename: 'main.js',
       },
       resolve: {
              extensions: [ '.ts', '.js' ],
       },
       module: {
              rules: [
                     {
                            test: /\.ts$/,
                            loader: 'ts-loader',
                            exclude: /node_modules/,
                     },
                     {
                            test: /\.node$/,
                            loader: 'node-loader',
                     },
              ],
       },
       optimization: {
              usedExports: true,
              minimize: true,
              minimizer: [
                     new TerserPlugin({
                            terserOptions: {
                                   compress: {
                                          drop_console: true,
                                   },
                            },
                     }),
              ],
       },
};
