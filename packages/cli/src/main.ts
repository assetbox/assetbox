#!/usr/bin/env node

import chalk from "chalk";

import packagesJson from "../package.json" assert { type: "json" };
import { initialize } from "./initialize";
import { log } from "./utils/console";
import { createServer } from "./utils/createServer";

const argv = process.argv.slice(2);
const prefixArgv = argv[0];

switch (prefixArgv) {
  case "version": {
    log("assetbox version", chalk.green(packagesJson.version));
    break;
  }
  case "init": {
    initialize();
    break;
  }
  case "dev": {
    createServer();
    break;
  }
}
