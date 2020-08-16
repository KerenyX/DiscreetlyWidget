const webpack = require('webpack');
const _ = require('dotenv').config().parsed;
const path = require('path');

module.exports = () => {
  return {
    entry : {
        "discreetly-widget": "./public/js/discreetly-chat-widget.js",
        chat: "./public/js/chat.js"
    },
    output: {
        path: path.resolve(__dirname, 'public')
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.DOMAIN": JSON.stringify(process.env.DOMAIN),
        "process.env.LANGUAGE": JSON.stringify(process.env.LANGUAGE)
      })
    ]
  };
};
