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

    // get filename without its '.txt' extension
    const fileName = path.basename(file, fileType);

    // write to 'dist' directory new html file
    fs.writeFileSync("./dist/" + fileName + ".html", fullHTML);
}

let files = [];
let mdFiles = [];
let currentDir = "./";
let stylesheet = "";

if (fs.existsSync(argv.input)) {
  // if input name is a '.txt' file, save it to files[0]
  if (fs.statSync(argv.input).isFile()) {
      if(argv.input.match(/.txt$/))
        files[0] = argv.input;
      if(argv.input.match(/.md$/))
        mdFiles[0] = argv.input;
  }

  // if input name is a directory, save all '.txt' files to files array
  if (fs.statSync(argv.input).isDirectory()) {
    currentDir = "./" + argv.input + "/";
    files = fs.readdirSync(currentDir).filter((file) => file.match(/.txt$/));
    mdFiles = fs.readdirSync(currentDir).filter((file) => file.match(/.md$/));
  }
} else {
  console.log("file or directory not found!");
}

if (fs.existsSync("./dist")) {
  fs.rmSync("./dist", { recursive: true }, (err) => {
    console.log(err);
  });
}

fs.mkdirSync("./dist", (err) => {
  console.log(err);
});
//if there is md file
if(mdFiles.length > 0) {
  mdFiles.forEach((file) => {
    
    let fullMdText = fs
      .readFileSync(currentDir + file, "utf-8")
      .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*)\*/gim, '<i>$1</i>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
      .replace(/^\`\`\`/gim, "")
      .trim();
      
    let htmlBody = fullMdText.split(/\r?\n\r?\n/).map((param, idx) => {
      if(!param.match(/^<h\d>/gm) && !param.match(/^<a/gm))
        return `<p>${param.replace(/\r?\n/, " ")}</p>`; 
      return param;
    }).join(" ");
    const title = htmlBody.slice(4, htmlBody.indexOf("</h1>"));
    htmlBody = htmlBody.substr(htmlBody.indexOf("</h1>", 1) + 6);
    writeHTMLFile(title, htmlBody, file, ".md")
  }) 
}
if(files.length > 0) {
  files.forEach((file) => {
    const fullText = fs.readFileSync(currentDir + file, "utf-8");
  
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


