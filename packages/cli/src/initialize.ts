import fs from "fs/promises";
import { resolve } from "path";
import prompts from "prompts";
import { findPackageRoot } from "workspace-tools";

export const initialize = async () => {
  let assetPath = "";
  let trackingPath = "";

  const { isAssetPathDefault } = await prompts({
    type: "toggle",
    name: "isAssetPathDefault",
    message: "Set assetPaths to the default.",
    initial: true,
    active: "Yes",
    inactive: "No",
  });

  const { isTrackingPathDefault } = await prompts({
    type: "toggle",
    name: "isTrackingPathDefault",
    message: "Set trackingPaths to the default.",
    initial: true,
    active: "Yes",
    inactive: "No",
  });

  if (isAssetPathDefault) {
    assetPath = "./src/assets/**/*";
  } else {
    console.log("Please write assetbox.config.js yourself.");
  }

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
    `module.exports = {
  assetPaths: [${`"${assetPath}"`}],
  trackingPaths: [${`"${trackingPath}"`}],
};
`
  );
};
