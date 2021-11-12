#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const { version } = require("./package.json");
const { parseConfigFile } = require("./lib/config");
const { parseInput } = require("./lib/input");
const argv = yargs
  .usage("Usage: $0 [options]")
  .option("i", {
    alias: "input",
    describe: "Load input file or directory",
  })
  .option("s", {
    alias: "stylesheet",
    describe: "Provide stylesheet",
  })
  .option("c", {
    alias: "config",
    describe: "Provide a path to a JSON file",
  })
  .alias("v", "version")
  .version(true, `dodo-SSG version: ${version}`)
  .alias("h", "help").argv;

if (!argv.input && !argv.config) {
  yargs.showHelp();
  process.exit(1);
}

if (fs.existsSync(path.join(process.cwd(), "dist"))) {
  try {
    fs.rmSync(path.join(process.cwd(), "dist"), { recursive: true });
  } catch {
    console.error("Unable to delete ./dist directory.");
    process.exit(-1);
  }
}

try {
  fs.mkdirSync(path.join(process.cwd(), "dist"));
} catch {
  console.error("Unable to create ./dist directory.");
  process.exit(-1);
}

if (argv.config) {
  const { input, stylesheet } = parseConfigFile(argv.config);
  argv.input = input;
  argv.stylesheet = stylesheet;
}

if (fs.existsSync(argv.input)) {
  parseInput(argv.input, argv.stylesheet);
} else {
  console.error("File or directory not found!");
  process.exit(-1);
}
