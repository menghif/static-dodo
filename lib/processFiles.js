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

const { writeHTMLFile } = require("./writeHTMLFile");

const parseMdFiles = (fullText) => {
  let htmlBody = md.render(fullText);
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

module.exports.processFiles = processFiles;
