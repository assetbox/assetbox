#!/usr/bin/env node

import { Command } from "commander";

import { version as packageVersion } from "../package.json";
import { manage, staticBuild } from "./commands";
import { iconBuild } from "./commands/iconBuild";
import { initialize } from "./initialize";

const program = new Command();

program
  .name("assetbox")
  .description(
    "Assets (svg, img, etc.) management tools to help you develop the web"
  )
  .version(packageVersion, "-v, --version", "output the current version");

program
  .command("init")
  .description("Create asset.config.js for the project")
  .action(async () => {
    try {
      await initialize();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  });

program
  .option("-p, --port <number>")
  .command("manage")
  .description("Open the development server of the assetbox.")
  .action(async () => {
    try {
      await manage(program.opts().port);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  });

program
  .command("static-build")
  .description(
    "Generate an icon/image viewer static site. The site is in read-only mode."
  )
  .action(async () => {
    try {
      await staticBuild();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  });

program
  .command("icon-build")
  .description("Build the svg file as a front-end framework component.")
  .action(async () => {
    try {
      await iconBuild();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  });

program.parse();
