const RasterizeSvgPathWebpackPlugin = require('@jarrodldavis/rasterize-svg-path-webpack-plugin');
const icons = require('@mdi/js');

const { INPUT_WIDTH, INPUT_HEIGHT, outputs } = require("./app/images.json");

const plugins = Object.values(outputs).map(output => {
  const pathData = icons[`mdi${output.icon}`];
  const { strokeColor, fillColor, filePath, format, width, height } = output;

  return new RasterizeSvgPathWebpackPlugin(
    pathData, INPUT_WIDTH, INPUT_HEIGHT, strokeColor, fillColor, [{ filePath, format, width, height }]
  );
});

module.exports = {
  webpack(config) {
    config.plugins.unshift(...plugins);
    return config;
  }
};
