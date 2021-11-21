const fs = require("fs");
const path = require("path");
const hljs = require("highlight.js");
const md = require("markdown-it")({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return "";
  },
});
const { writeHTML } = require("./writeHTML");

const parseMdFile = (fullText) => {
  let htmlBody = md.render(fullText);
  return htmlBody.substr(htmlBody.indexOf("\n", 1));
};

const parseTxtFile = (fullText) => {
  const fullTxtText = fullText;

  let htmlBody = fullTxtText
    .split(/\r?\n\r?\n/)
    .map((para) => `<p>${para.replace(/\r?\n/, " ")}</p>\n`)
    .join(" ");

  // remove first line of htmlBody and return
  return htmlBody.substr(htmlBody.indexOf("\n", 1));
};

const processFile = (file, currentDir, stylesheet) => {
  const fullText = fs.readFileSync(path.join(currentDir, file), "utf-8");
  let title = "";
  let htmlBody = "";
  if (file.match(/.txt$/)) {
    htmlBody = parseTxtFile(fullText);
    title = fullText.substr(0, fullText.indexOf("\n"));
  }
  if (file.match(/.md$/)) {
    htmlBody = parseMdFile(fullText);
    title = fullText.substr(1, fullText.indexOf("\n"));
  }
  const fullHTML = writeHTML(title, htmlBody, stylesheet);

  // get filename without its '.txt' extension and append '.html' to it
  const HtmlFileName = path.basename(file, path.extname(file)) + ".html";

  // write to './dist' directory new html file
  fs.writeFileSync(path.join(process.cwd(), "dist", HtmlFileName), fullHTML);
};

module.exports.parseMdFile = parseMdFile;
module.exports.parseTxtFile = parseTxtFile;
module.exports.processFile = processFile;
