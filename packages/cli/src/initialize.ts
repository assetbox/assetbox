import fs from "fs/promises";
import { resolve } from "path";
import prompts from "prompts";
import js from "ts-dedent";
import { findPackageRoot } from "workspace-tools";
export const initialize = async () => {
  let trackingPath = "";

  const { isTrackingPathDefault } = await prompts({
    type: "toggle",
    name: "isTrackingPathDefault",
    message: "Set trackingPaths to the default.",
    initial: true,
    active: "Yes",
    inactive: "No",
  });

  if (isTrackingPathDefault) {
    trackingPath = "./src/**/*.*";
  } else {
    console.log("Please write assetbox.config.js yourself.");
  }

  const packageRoot = findPackageRoot(process.cwd());
  if (!packageRoot) {
    throw new Error("Couldn't find package root.");
  }

  await fs.writeFile(
    resolve(packageRoot, "assetbox.config.cjs"),
    js`
module.exports = {
  categories: {},
  trackingPaths: [${`"${trackingPath}"`}],
};
`
  );
};
