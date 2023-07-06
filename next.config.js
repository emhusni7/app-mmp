const path = require('path');
const runtimeCaching = require("next-pwa/cache");
const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: "public",
    runtimeCaching,
    disable: process.env.NODE_ENV === "development"
  },
//  reactStrictMode:true,
  webpack5: true,
  webpack: (config) => {
    
    config.resolve.fallback = { 
      fs: false,
      crypto: false,
      stream: false,
      timers: false,
      querystring: require.resolve("querystring-es3") };

    // load worker files as a urls with `file-loader`
    // load worker files as a urls with `file-loader`
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[contenthash].[ext]",
            publicPath: "_next/static/worker",
            outputPath: "static/worker"
          }
        }
      ]
    });
     return config;
 },
  // reactStrictMode: true,
  // images: {
  //   domains: ['reqres.in'],
  // },
});
