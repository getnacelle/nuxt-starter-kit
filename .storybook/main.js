const path = require('path');

module.exports = {
  stories: ['../components/stories/*.stories.[tj]s'],
  webpackFinal: async (config, resolve) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });
    
    resolve.alias = {
      '@': path.dirname(path.resolve(__dirname))
    }

    return config;
  },
}
