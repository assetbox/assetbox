/**
 * @type {import('@assetbox/cli').AssetBoxScheme}
 */
const config = {
  categories: {
    Icons: ["./src/assets/icons/**/*"],
    Images: ["./public/images/**/*"],
  },
  trackingPaths: ["./src/**/*"],
};

module.exports = config;
