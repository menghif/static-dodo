import fs from "fs";
import process from "process";
import path from "path";

export const parseInput = (input) => {
  let files = [];
  let currentDir = process.cwd();
  // if input name is a '.txt' file, save it to txtFiles[0]
  if (fs.statSync(input).isFile()) {
    if (input.match(/.txt$/) || input.match(/.md$/)) files[0] = input;
  }

  // if input name is a directory, save all '.txt' files to files array
  if (fs.statSync(input).isDirectory()) {
    currentDir = path.join(currentDir, input);
    files = fs
      .readdirSync(currentDir)
      .filter(
        (file) =>
          fs.statSync(path.join(currentDir, file)).isFile() &&
          (file.match(/.txt$/) || file.match(/.md$/)),
      );
  }
  return { files, currentDir };
};
