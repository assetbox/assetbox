#!/usr/bin/env node

import { Command } from "commander";

import { version as packageVersion } from "../package.json";
import { initialize } from "./initialize";
import { createServer } from "./ssr/createServer";

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
  .command("dev")
  .description("Open the development server of the assetbox")
  .action(async () => {
    try {
      await createServer();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  });

program.parse();
