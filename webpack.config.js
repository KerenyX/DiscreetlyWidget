const webpack = require('webpack');
const _ = require('dotenv').config().parsed;
const path = require('path');

module.exports = () => {
  return {
    entry : {
        "discreetly-widget": "./public/js/discreetly-chat-widget.js",
        chat: "./public/js/chat.js",
        style: "./public/css/style.scss"
    },
    output: {
        path: path.resolve(__dirname, 'public')
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.DOMAIN": JSON.stringify(process.env.DOMAIN),
        "process.env.LANGUAGE": JSON.stringify(process.env.LANGUAGE)
      })
    ],
    module: {
        rules: [ 
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [],
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('file-loader'),
                        options: { 
                            outputPath: 'css/', 
                            name: 'style.min.css'
                        }
                    },
                    'sass-loader'
                ]
            }
        ],
      }
  };
};
