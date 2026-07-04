import webpack from "webpack";
import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import "webpack-dev-server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: webpack.Configuration = {
    entry: "./src/view/web/index.tsx",
    target: "web",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ["@tailwindcss/postcss"],
                                    ["postcss-flexbugs-fixes"],
                                    ["postcss-preset-env"],
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [new HtmlWebpackPlugin({ template: "public/index.html" })],
    devServer: {
        port: 3000,
        hot: true,
        compress: true,
        static: { directory: path.join(__dirname, "public") },
        historyApiFallback: true,
    },
};

export default config;
