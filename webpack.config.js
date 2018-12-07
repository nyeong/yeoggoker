const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, options) => {
  const devMode = options.mode !== "production";

  const config = {
    entry: {
      app: ["./src/index.ts", "./src/styles/all.scss"]
    },
    devtool: "inline-source-map",
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "docs")
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: "ts-loader"
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader"
          ]
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: devMode ? "[name].css" : "[name].[hash].css",
        chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src/index.html")
      })
    ]
  };

  if (options.mode === "development") {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    config.devtool = "inline-source-map";

    config.devServer = {
      hot: true,
      host: "localhost",
      port: "3000",
      contentBase: "./docs",
      hotOnly: true,
      stats: {
        color: true
      }
    };
  } else {
    config.plugins.push(new CleanWebpackPlugin(["docs"]));
  }
  return config;
};
