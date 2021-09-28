#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { version } = require("./package.json");

const argv = require("yargs")
  .usage("Usage: $0 [options]")
  .alias("i", "input")
  .describe("i", "Load input file or directory")
  .demandOption(["i"])
  .alias("s", "stylesheet")
  .describe("s", "Provide stylesheet")
  .alias("v", "version")
  .version(true, `dodo-SSG version: ${version}`)
  .alias("h", "help").argv;

const writeHTMLFile = (title, body, file, fileType) => {
  // if user provided a stylesheet, include stylesheet in the html
  if (argv.stylesheet) {
    stylesheet = `<link rel="stylesheet" href="${argv.stylesheet}">`;
  }
  const fullHTML = `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${stylesheet}
    </head>
    <body>
      <h1>${title}</h1>
    ${body}
    </body>
    </html>`;

  // get filename without its '.txt' extension and append '.html' to it
  const HtmlFileName = path.basename(file, fileType) + ".html";

  // write to './dist' directory new html file
  fs.writeFileSync(path.join(process.cwd(), "dist", HtmlFileName), fullHTML);
};

let files = [];
let mdFiles = [];
let currentDir = process.cwd();
let stylesheet = "";

if (fs.existsSync(argv.input)) {
  // if input name is a '.txt' file, save it to files[0]
  if (fs.statSync(argv.input).isFile()) {
    if (argv.input.match(/.txt$/)) files[0] = argv.input;
    if (argv.input.match(/.md$/)) mdFiles[0] = argv.input;
  }

  // if input name is a directory, save all '.txt' files to files array
  if (fs.statSync(argv.input).isDirectory()) {
    currentDir = path.join(currentDir, argv.input);
    files = fs
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
} else {
  console.error("File or directory not found!");
  process.exit(-1);
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

//if there is md file
if (mdFiles.length > 0) {
  mdFiles.forEach((file) => {
    let fullMdText = fs
      .readFileSync(path.join(currentDir, file), "utf-8")
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
      .map((param, idx) => {
        if (!param.match(/^<h\d>/gm)) return `\t<p>${param}</p>\n`;
        return `\t${param}\n`;
      })
      .join(" ");
    const title = htmlBody.slice(
      htmlBody.indexOf("<h1>") + 4,
      htmlBody.indexOf("</h1>")
    );

    htmlBody = htmlBody.substr(htmlBody.indexOf("</h1>", 1) + 6);
    writeHTMLFile(title, htmlBody, file, ".md");
  });
}

if (files.length > 0) {
  files.forEach((file) => {
    const fullText = fs.readFileSync(path.join(currentDir, file), "utf-8");

    // get title from first line of text
    const title = fullText.substr(0, fullText.indexOf("\n"));

    let body = fullText
      .split(/\r?\n\r?\n/)
      .map((para) => `\t<p>${para.replace(/\r?\n/, " ")}</p>\n\n`)
      .join(" ");

    // remove first line of body
    body = body.substr(body.indexOf("\n", 1));
    writeHTMLFile(title, body, file, ".txt");
  });
}
