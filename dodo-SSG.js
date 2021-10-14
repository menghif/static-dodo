#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const { version } = require("./package.json");

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

const writeHTMLFile = (title, body, file, fileType, stylesheet) => {
  const fullHTML = `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="${stylesheet}">
    </head>
    <body>
      <h1>${title}</h1>
    ${body}
    </body>
    </html>`;

  // get filename without its '.txt' extension and append '.html' to it
  const HtmlFileName = path.basename(file, fileType) + "html";

  // write to './dist' directory new html file
  fs.writeFileSync(path.join(process.cwd(), "dist", HtmlFileName), fullHTML);
};

const parseMdFiles = (fullText) => {
  const fullMdText = fullText
    .replace(/^###### (.*$)/gim, "<h6>$1</h6>")
    .replace(/^##### (.*$)/gim, "<h5>$1</h5>")
    .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>")
    .replace(/\*(.*)\*/gim, "<i>$1</i>")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .replace(/`([^`]*)`/gim, "<code>$1</code>")
    .replace(/^---$/m, "<hr>")
    .replace(/^\`\`\`/gim, "")
    .trim();

  let htmlBody = fullMdText
    .split(/\r?\n\r?\n/)
    .map((param) => {
      if (!param.match(/^<h\d>/gm) && !param.match(/^<hr>$/gm))
        return `\t<p>${param}</p>\n`;
      return `\t${param}\n`;
    })
    .join(" ");

  return htmlBody.substr(htmlBody.indexOf("</h1>", 1) + 6);
};

const parseTxtFiles = (fullText) => {
  const fullTxtText = fullText;

  let htmlBody = fullTxtText
    .split(/\r?\n\r?\n/)
    .map((para) => `\t<p>${para.replace(/\r?\n/, " ")}</p>\n\n`)
    .join(" ");

  // remove first line of htmlBody and return
  return htmlBody.substr(htmlBody.indexOf("\n", 1));
};

const extractTitle = (fileType, fullText) => {
  if (fileType === "txt") {
    // get title from first line of text
    return fullText.substr(0, fullText.indexOf("\n"));
  }
  if (fileType === "md") {
    return fullText.substr(1, fullText.indexOf("\n"));
  }
};

const processFiles = (files, fileType, currentDir, stylesheet) => {
  files.forEach((file) => {
    const fullText = fs.readFileSync(path.join(currentDir, file), "utf-8");
    const title = extractTitle(fileType, fullText);
    let htmlBody = "";
    if (fileType === "txt") {
      htmlBody = parseTxtFiles(fullText);
    }
    if (fileType === "md") {
      htmlBody = parseMdFiles(fullText);
    }
    writeHTMLFile(title, htmlBody, file, fileType, stylesheet);
  });
};

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
  if (!(typeof argv.config === "string" || argv.config instanceof String)) {
    console.error("Please enter a path to a JSON file.");
    process.exit(1);
  }

  if (!argv.config.endsWith(".json")) {
    console.error('Please provide a file that ends with "json" extension.');
    process.exit(1);
  }

  if (!fs.existsSync(argv.config)) {
    console.error("The file does not exist.");
    process.exit(1);
  }

  if (!fs.statSync(argv.config).isFile()) {
    console.error(
      "This is not a regular input file. Please enter a text file. "
    );
    process.exit(1);
  }

  let fileContent = "";
  try {
    fileContent = fs.readFileSync(argv.config);
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
    process.exit(1);
  }

  if (configFile["input"]) {
    argv.input = configFile["input"];
  } else {
    console.error("Please provide a path to a text file.");
    process.exit(1);
  }

  argv.stylesheet = configFile["stylesheet"];
}

if (fs.existsSync(argv.input)) {
  let txtFiles = [];
  let mdFiles = [];
  let currentDir = process.cwd();
  // if input name is a '.txt' file, save it to txtFiles[0]
  if (fs.statSync(argv.input).isFile()) {
    if (argv.input.match(/.txt$/)) txtFiles[0] = argv.input;
    if (argv.input.match(/.md$/)) mdFiles[0] = argv.input;
  }

  // if input name is a directory, save all '.txt' files to files array
  if (fs.statSync(argv.input).isDirectory()) {
    currentDir = path.join(currentDir, argv.input);
    txtFiles = fs
      .readdirSync(currentDir)
      .filter(
        (file) =>
          fs.statSync(path.join(currentDir, file)).isFile() &&
          file.match(/.txt$/)
      );

    mdFiles = fs
      .readdirSync(currentDir)
      .filter(
        (file) =>
          fs.statSync(path.join(currentDir, file)).isFile() &&
          file.match(/.md$/)
      );
  }

  // if user provided a stylesheet, include stylesheet in the html
  let stylesheet = "";
  if (argv.stylesheet) {
    stylesheet = argv.stylesheet;
  }

  if (mdFiles.length > 0) {
    processFiles(mdFiles, "md", currentDir, stylesheet);
  }

  if (txtFiles.length > 0) {
    processFiles(txtFiles, "txt", currentDir, stylesheet);
  }
} else {
  console.error("File or directory not found!");
  process.exit(-1);
}
