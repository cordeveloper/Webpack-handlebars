const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackNotifier = require('webpack-notifier');
const webpack = require('webpack');
const ZipPlugin = require('zip-webpack-plugin');


const dev = process.env.NODE_ENV !== 'production';
const prod = !dev;

module.exports = {

  // Se carga primero el polifyll para webcomponents nativos
  entry: ['@webcomponents/webcomponentsjs', './src/app.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js'
  },
  module: {
    rules: [{
        test: /\.(sa|sc|c)ss$/,
        use: [{
            /*
              Se carga el archivo de sass desde el app.js,
              se hacen las modificiones de autoprefixer con postcss-loader,
              se carga el css resultante en el bundle.js,
              se extrae el css a un archivo externo con MiniCssExtractPlugin.
            */
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: dev,
              reloadAll: true,
              // publicPath añadira ../ a todas las url relativas de las depencias del css (fuentes e imágenes).
              publicPath: '../'
            }
          },

          'css-loader', 'postcss-loader', 'sass-loader'
        ]
      },
      {
        // Procesa todas las dependencias de imagenes del css, html y js excluyendo las que contengan en 
        // la ruta webfonts
        test: /\.(jpg|png|gif|jpeg|svg)$/,
        exclude: [/webfonts/],
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: './assets/img',
            esModule: false,
          }
        }]
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
      // Procesa todas las dependencias de fuentes del css excluyendo las que contengan en 
      // la ruta img e image
      {
        test: /\.(ttf|woff|woff2|eot|svg)$/i,
        exclude: [/img/, /image/],
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'assets/webfonts',
            name: '[name].[ext]'
          }
        }]
      },
      // Procesa los archivos hdl, requiere como dependencias de imagenes las url que contengan /assets/img
      {
        test: /\.handlebars$/,
        use: [{
          loader: "handlebars-loader",
          query: {
            inlineRequires: '/assets/img/'
          }
        }, ]
      },
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        },

      }

    ]
  },
  plugins: [
    // Indica en porcentaje el porcentaje de compilado
    new webpack.ProgressPlugin(),
    // Regenera todos los assets en cada ejecución de Webpack
    new CleanWebpackPlugin(),
    // Determina la salida del css
    new MiniCssExtractPlugin({
      filename: 'css/style.css'
    }),
    // Define los template html
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
    new WebpackNotifier({
      contentImage: path.resolve(__dirname, '../webpack.png')
    }),
  ],
  // La opcion hot a false no recargará el browser cuando haya cambios
  devServer: {
    port: 4200,
    //hot: dev
  },
  // Permite trocear los assets resultantes en dist en varios archivos
  /*  optimization: {
     splitChunks: {
       chunks: dev ? 'async' : 'all'
     }
   } */


}

if(prod){
  module.exports.plugins.push(
    new ZipPlugin({
      filename: 'dist.zip'
    })
  )
}