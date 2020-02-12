const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackNotifier = require('webpack-notifier');



module.exports = env => {  
  
  const dev = env.development;
  const prod = !env.development;
  
  return {
    entry: './src/app.js',
    output: {
      path:  path.resolve(__dirname,'../dist'),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader:   MiniCssExtractPlugin.loader,
              options: {
                hmr: dev,
                reloadAll: true,
                publicPath: '../'
              }
            },
    
            'css-loader', 'sass-loader'
          ]
        },
        {
          test: /\.(jpg|png|gif|jpeg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/img',
                esModule: false,
              }
            }
          ]
        },
        {
          loader: 'image-webpack-loader',
          options: {
            disable: dev,
            mozjpeg: {
              progressive: true,
              quality: 65
            },
            // optipng.enabled: false will disable optipng
            optipng: {
              enabled: true,
            },
            pngquant: {
              quality: [0.65, 0.90],
              speed: 4
            },
            gifsicle: {
              interlaced: false,
            },
            // the webp option will enable WEBP
            webp: {
              quality: 75
            }
          }
        },
        {
          test: /\.handlebars$/,
          use: [
            {
              loader: "handlebars-loader",
              query: {
                inlineRequires: '/assets/img/'
              }
            },
          ]
        }
        
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/style.css'
      }),
      new HtmlWebpackPlugin({
        template: './src/index.handlebars',
        minify: {
          collapseWhitespace: prod,
          removeComments: prod,
          removeRedundantAttributes: prod,
          removeScriptTypeAttributes: prod,
          removeStyleLinkTypeAttributes: prod,
          useShortDoctype: prod
        }
      }),
      new WebpackNotifier(
        {contentImage: path.resolve(__dirname, '../webpack.png')}
    ),
    ]
  }
   
}
 
