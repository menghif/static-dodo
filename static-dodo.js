#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const minimist = require("minimist");
const { version } = require("./package.json");
const getHelp = require("./lib/help");
const { parseConfigFile } = require("./lib/config");
const { parseInput } = require("./lib/input");
const { processFile } = require("./lib/processFile");

const argv = minimist(process.argv.slice(2), {
  string: ["input", "stylesheet", "config"],
  boolean: ["version", "help"],
  alias: { i: "input", s: "stylesheet", c: "config", v: "version", h: "help" },
  unknown: (unknownArgument) => {
    console.error(`Option '${unknownArgument}' not found.`);
  },
});

if (argv.version) {
  console.log(version);
  process.exit(0);
}

if (argv.help) {
  getHelp();
  process.exit(0);
}

if (argv.input) {
  console.log(argv.input);
}

if (!argv.input && !argv.config) {
  getHelp();
  process.exit(0);
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
  const { files, currentDir } = parseInput(argv.input);
  if (files.length > 0) {
    files.forEach((file) => {
      processFile(file, currentDir, argv.stylesheet);
    });
  }
} else {
  console.error("File or directory not found!");
  process.exit(-1);
}
