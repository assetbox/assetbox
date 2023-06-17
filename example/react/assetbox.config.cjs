const { react } = require("@assetbox/plugin-react-icon");

/**
 * @type {import('@assetbox/cli').AssetBoxScheme}
 */
const config = {
  categories: {
    Icons: ["./src/assets/icons/**/*"],
    Login: ["./src/assets/login/**/*"],
    Images: ["./public/images/**/*"],
  },
  trackingPaths: ["./src/**/*"],
  iconBuild: {
    plugins: [
      react({
        outDir: "icon-dist",
      }),
    ],
  },
};

module.exports = config;
