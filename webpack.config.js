/* global process, __dirname */
/* eslint-env node */
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");

const TARGET = process.env.npm_lifecycle_event;
const ROOT_PATH = path.resolve(__dirname);

const PATHS = {
    src: "src/",
    srcjs: "src/js"
};

let exportModule = {};

const common = {
    entry: {
        index: path.resolve(ROOT_PATH, PATHS.srcjs, "index.js")
    },
    module: {
        loaders: [
            {
                loader: "babel-loader",
                include: [path.resolve(__dirname, PATHS.srcjs)],
                // Only run `.js` files through Babel
                test: /\.js?$/
            }
        ]
    },
    resolve: {
        extensions: [".js", "min.js"],
        alias: {
            Kendo: path.resolve("node_modules/@progress/kendo-ui/js/") // the path to the kendo npm scripts
        }
    },
    devtool: "source-map"
};

if (TARGET === "buildwp") {
    // Includes minification, so slow build times and smaller files.  Use for final build to prod only.
    exportModule = merge(common, {
        output: {
            path: path.resolve(ROOT_PATH, "build/js/"),
            filename: "[name].js"
        },

        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: "vendor",
                filename: "vendor.js",
                minChunks: module => {
                    const userRequest = module.userRequest;

                    // module.userRequest returns name of file, including path
                    return (
                        userRequest &&
                        userRequest.match(/\.js$/) &&
                        userRequest.indexOf("node_modules") >= 0
                    );
                }
            }),
            new webpack.DefinePlugin({
                "process.env": { NODE_ENV: '"production"' } // eslint-disable-line quotes
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    warnings: false
                }
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            })
        ]
    });
}

const devServerCommon = {
    devServer: {
        noInfo: false,
        historyApiFallback: true,
        hot: true,
        inline: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
};

const startCommon = merge(common, devServerCommon);

if (TARGET === "start" || !TARGET) {
    exportModule = merge(startCommon, {
        output: {
            filename: "src/[name]bundle.js"
        }
    });
}

module.exports = exportModule;
