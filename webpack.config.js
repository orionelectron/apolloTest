const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = function (_env, argv) {
    const isProduction = argv.mode === "production";
    const isDevelopment = !isProduction;

    return {
        mode: "none",
        devtool: isDevelopment && "cheap-module-source-map",
        entry: "./src/index.tsx",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "assets/js/[name].[contenthash:8].js",
            publicPath: "auto"
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                            envName: isProduction ? "production" : "development"
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                import: true,
                                url: true
                            }
                        },
                    ]
                },
                {
                    test: /\*.module.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                modules: true,
                                url: true
                            }
                        },
                        
                    ]
                },
                
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/i,
                    type: 'asset/resource'
                },
                
            ]
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx"]
        },
        plugins: [
            isProduction &&
            new MiniCssExtractPlugin({
                filename: "assets/css/[name].[contentHash:8].css",
                chunkFilename: "assets/css/[name].[contenthash:8].chunk.css"
            }),
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development"),
                "process.env.PUBLIC_URL": JSON.stringify("/public")
            }),
            /*
            new WorkboxPlugin.GenerateSW({
                swDest: "service-worker.js",
                clientsClaim: true,
                skipWaiting: true
            }),
            */
            new ForkTsCheckerWebpackPlugin({
                async: false
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "public/index.html"),
                favicon: "./public/favicon.ico",
                filename: "index.html",
                manifest: "./public/manifest.json",
                inject: true
            })
        ].filter(Boolean),
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserWebpackPlugin({
                    terserOptions: {
                        compress: {
                            comparisons: false
                        },
                        mangle: {
                            safari10: true
                        },
                        output: {
                            comments: false,
                            ascii_only: true
                        },
                        warnings: false
                    }
                }),
                new OptimizeCssAssetsPlugin()
            ],
            splitChunks: {
                chunks: "all",
                minSize: 0,
                maxInitialRequests: 20,
                maxAsyncRequests: 20,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module, chunks, cacheGroupKey) {
                            const packageName = module.context.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                            )[1];
                            return `${cacheGroupKey}.${packageName.replace("@", "")}`
                        }
                    },

                    common: {
                        minChunks: 2,
                        priority: -10
                    }
                }
            }
        },
        devServer: {
            compress: true,
            historyApiFallback: true,
            open: true,
            client: {
                overlay: true
            }

        }
    }

}