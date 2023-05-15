const memfs = require("memfs");

const glob = require("glob");
const originalGlob = glob.glob.bind();

glob.glob = function (pattern, options) {
  return originalGlob(pattern, { fs: memfs, ...options });
};

module.exports = glob;
