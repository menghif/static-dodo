const path = require("path");
const process = require("process");
const fs = require("fs");

const { writeHTML } = require("./writeHTML");

const writeHTMLFile = (title, body, file, fileType, stylesheet) => {
  const fullHTML = writeHTML(title, body, stylesheet);

  // get filename without its '.txt' extension and append '.html' to it
  const HtmlFileName = path.basename(file, fileType) + "html";

  // write to './dist' directory new html file
  fs.writeFileSync(path.join(process.cwd(), "dist", HtmlFileName), fullHTML);
};

module.exports.writeHTMLFile = writeHTMLFile;
