const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const MiniCSSPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

let mode = "development";

if (process.env.NODE_ENV === "production") {
  mode = "production";
}

module.exports = {
  mode: mode,
  entry: "./index.js",
  context: path.resolve("src"),

  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|c|sc)ss$/,
        use: [
          MiniCSSPlugin.loader,
          "css-loader",
          { loader: "postcss-loader" },
          "sass-loader",
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(eot|ttf|otf|woff|woff2)$/i,
        generator: {
          filename: "fonts/[name][ext]",
        },
        type: "asset/resource",
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "./img/", to: "img" }],
    }),
    new HTMLPlugin({
      template: path.join(__dirname, "./src/index.html"),
      minify: false,
      inject: "head",
    }),
    new MiniCSSPlugin({
      filename: "css/[name]_[contenthash].css",
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    minimize: false,
  },
  output: {
    filename: "js/[name]_[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    // assetModuleFilename: "assets/[name]_[hash][ext][query]",
    assetModuleFilename: "img/[name][ext]",
    clean: true,
  },
  devtool: "source-map",
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    watchFiles: ["./src/**/*"],
    port: 4000,
  },
};
