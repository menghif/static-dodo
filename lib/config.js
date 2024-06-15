// Use -c or --config for JSON config file

import fs from "fs";
import process from "process";

export const parseConfigFile = (config) => {
  if (!(typeof config === "string" || config instanceof String)) {
    console.error("Please enter a path to a JSON file.");
    process.exit(1);
  }

  if (!config.endsWith(".json")) {
    console.error('Please provide a file that ends with "json" extension.');
    process.exit(1);
  }

  if (!fs.existsSync(config)) {
    console.error("The file does not exist.");
    process.exit(1);
  }

  if (!fs.statSync(config).isFile()) {
    console.error(
      "This is not a regular input file. Please enter a text file. ",
    );
    process.exit(1);
  }

  let fileContent = "";
  try {
    fileContent = fs.readFileSync(config);
  } catch (err) {
    console.error("There has been an error while reading the file.");
    console.error(err);
    process.exit(1);
  }

  let configFile = {};
  try {
    configFile = JSON.parse(fileContent);
  } catch (err) {
    console.error("This file cannot be parsed as a JSON.");
    console.error(err);
    process.exit(1);
  }

  let input = "";
  let stylesheet = "";

  if (configFile["input"]) {
    input = configFile["input"];
  } else {
    console.error("Please provide a path to a text file.");
    process.exit(1);
  }

  stylesheet = configFile["stylesheet"];

  return { input, stylesheet };
};
