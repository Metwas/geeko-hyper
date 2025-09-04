// webpack.config.js
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
       entry: './src/main.ts',
       target: 'node',
       // ❌ remove externals: [nodeExternals()] to include node_modules
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
                            loader: 'node-loader',   // 👈 handles native addons
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
