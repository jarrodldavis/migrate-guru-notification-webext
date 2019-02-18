const path = require('path');

const RasterizeSvgPathWebpackPlugin = require('@jarrodldavis/rasterize-svg-path-webpack-plugin');
const icons = require('@mdi/js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { INPUT_WIDTH, INPUT_HEIGHT, outputs } = require("./app/images.json");

const plugins = Object.values(outputs).map(output => {
  const pathData = icons[`mdi${output.icon}`];
  const { strokeColor, fillColor, filePath, format, width, height } = output;

  return new RasterizeSvgPathWebpackPlugin(
    pathData, INPUT_WIDTH, INPUT_HEIGHT, strokeColor, fillColor, [{ filePath, format, width, height }]
  );
});

module.exports = {
  // https://github.com/webextension-toolbox/webextension-toolbox/blob/0183506baaf96eb0ae56cd70da71807bc8dbb65d/src/webpack-config.js#L19
  copyIgnore: ['**/*.js', '**/*.json', '**/*.svelte'],
  webpack(config, { vendor }) {
    config.module.rules.push({
      test: /\.svelte$/,
      exclude: /node_modules/,
      use: {
        loader: 'svelte-loader',
        options: {
          css: false
        }
      }
    });
    config.plugins.unshift(...plugins);

    if (vendor !== 'firefox') {
      config.plugins.push(new CopyWebpackPlugin([{
        context: config.output.path,
        from: path.resolve(__dirname, './photon-extension-kit/extension.css'),
        to: './styles/'
      }]));
    }

    return config;
  }
};
