const path = require('path');

// config for example code styleguide
module.exports = {
  sections: [
    {
      name: 'Introduction',
      content: 'README.md',
    },
    {
      name: 'API Reference',
      content: 'docs/API.md',
    },
    {
      name: 'Example Components',
      components: 'example/components/**/*.js',
    },
  ],
  ignore: ['example/components/**/index.js'],
  styleguideDir: 'docs',
  require: ['styled-components', path.join(__dirname, 'src/StyleRenderer')],
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'example/Wrapper'),
  },
  webpackConfig: {
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        // Babel loader, will use your project’s .babelrc
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react', 'stage-0'],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: 'cat__[local]_[path]',
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.(jpg|jpeg|png|webp|ico)$/,
          use: 'file-loader',
        },
        {
          test: /\.(svg|woff|woff2|eot|otf|ttf)$/,
          use: 'file-loader',
        },
      ],
    },
  },
};
