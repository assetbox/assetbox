import fs from "fs/promises";
import { resolve } from "path";
import prompts from "prompts";
import { findPackageRoot } from "workspace-tools";

export const initialize = async () => {
  let assetPath = "";
  const { shouldDefault } = await prompts({
    type: "toggle",
    name: "shouldDefault",
    message: "Set assetPaths to the default.",
    initial: true,
    active: "Yes",
    inactive: "No",
  });

  if (shouldDefault) {
    assetPath = "./src/assets/**/*";
  } else {
    console.log("Please write assetbox.config.json yourself.");
  }

  const packageRoot = findPackageRoot(process.cwd());
  if (!packageRoot) {
    throw new Error("Couldn't find package root.");
  }

  await fs.writeFile(
    resolve(packageRoot, "assetbox.config.json"),
    JSON.stringify({ assetPaths: [assetPath] }, null, 2)
  );
};
