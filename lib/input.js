const fs = require("fs");
const { processFiles } = require("./processFiles");

const parseInput = (input, stylesheet) => {
  let txtFiles = [];
  let mdFiles = [];
  let currentDir = process.cwd();
  // if input name is a '.txt' file, save it to txtFiles[0]
  if (fs.statSync(input).isFile()) {
    if (input.match(/.txt$/)) txtFiles[0] = input;
    if (input.match(/.md$/)) mdFiles[0] = input;
  }

  // if input name is a directory, save all '.txt' files to files array
  if (fs.statSync(input).isDirectory()) {
    currentDir = path.join(currentDir, input);
    txtFiles = fs
      .readdirSync(currentDir)
      .filter((file) => fs.statSync(path.join(currentDir, file)).isFile() && file.match(/.txt$/));

    mdFiles = fs
      .readdirSync(currentDir)
      .filter((file) => fs.statSync(path.join(currentDir, file)).isFile() && file.match(/.md$/));
  }

  if (mdFiles.length > 0) {
    processFiles(mdFiles, "md", currentDir, stylesheet);
  }

  if (txtFiles.length > 0) {
    processFiles(txtFiles, "txt", currentDir, stylesheet);
  }
};

module.exports.parseInput = parseInput;
