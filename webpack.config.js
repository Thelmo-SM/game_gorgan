const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/main.js",
  

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
    publicPath: "/", // 🔥 CLAVE para assets (IMÁGENES)
  },

  mode: "development",

  devtool: "source-map",

  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 8080,
    open: true,
    hot: true,
    historyApiFallback: true, // 🔥 evita bugs de rutas
  },

  module: {
    rules: [
      // IMÁGENES (sprites, backgrounds)
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },

      // JS (opcional pero bueno para crecer)
      {
        
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      //sonidos
      {
    test: /\.(mp3|wav|ogg)$/i,
    type: 'asset/resource',
},
{
  test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
  type: 'asset/resource',
}
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
    }),
  ],

  resolve: {
    extensions: [".js"],
  }, 
  
};