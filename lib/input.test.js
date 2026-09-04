import { afterEach, beforeEach, describe, expect, test } from "vitest";

import process from "process";
import { parseInput } from "./input.js";
import fs from "fs";
import os from "os";
import path from "path";

describe("parseInput function testing", () => {
  test("File correctly passed to parseInput function", () => {
    const inputFile = parseInput("./sample_files/Silver Blaze.txt");
    expect(inputFile.files).toStrictEqual(["./sample_files/Silver Blaze.txt"]);
  });

  test("Directory correctly passed to parseInput function", () => {
    let dir = "sample_files";
    const inputDir = parseInput(dir);
    let filesArray = [];

    fs.readdirSync(dir).forEach((file) => {
      filesArray.push(file);
    });
    expect(inputDir.currentDir).toBe(process.cwd() + `/${dir}`);
    expect(inputDir.files).toEqual(expect.arrayContaining(filesArray));
  });

  test("Input file does not exist", () => {
    let fileName = "WrongName.txt";
    expect(() => {
      parseInput(fileName);
    }).toThrowError(`ENOENT: no such file or directory, stat '${fileName}'`);
  });

  test("Input folder does not exist", () => {
    let folderName = "WrongName";

    expect(() => {
      parseInput(folderName);
    }).toThrowError(`ENOENT: no such file or directory, stat '${folderName}'`);
  });

  test("Input argument not passed to parseInput function", () => {
    expect(() => {
      parseInput();
    }).toThrow();
  });

  describe("with a temporary directory", () => {
    let tmpDir;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "static-dodo-input-"));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    test("A single .md file is picked up", () => {
      const filePath = path.join(tmpDir, "readme.md");
      fs.writeFileSync(filePath, "# Title");

      const result = parseInput(filePath);

      expect(result.files).toStrictEqual([filePath]);
    });

    test("A single file with an unsupported extension is ignored", () => {
      const filePath = path.join(tmpDir, "notes.csv");
      fs.writeFileSync(filePath, "a,b,c");

      const result = parseInput(filePath);

      expect(result.files).toStrictEqual([]);
    });

    test("A file that merely ends in the letters txt or md is not treated as a match", () => {
      const txtLookalike = path.join(tmpDir, "report_txt");
      const mdLookalike = path.join(tmpDir, "report_md");
      fs.writeFileSync(txtLookalike, "hello");
      fs.writeFileSync(mdLookalike, "# hello");

      expect(parseInput(txtLookalike).files).toStrictEqual([]);
      expect(parseInput(mdLookalike).files).toStrictEqual([]);
    });

    test("A directory only picks up matching files and skips subdirectories and other extensions", () => {
      fs.writeFileSync(path.join(tmpDir, "a.txt"), "hello");
      fs.writeFileSync(path.join(tmpDir, "b.md"), "# hello");
      fs.writeFileSync(path.join(tmpDir, "c.csv"), "ignored");
      fs.writeFileSync(path.join(tmpDir, "report_txt"), "ignored");
      fs.mkdirSync(path.join(tmpDir, "subfolder"));

      const result = parseInput(tmpDir);

      expect(result.files.sort()).toStrictEqual(["a.txt", "b.md"]);
    });

    test("A directory with no matching files returns an empty array", () => {
      fs.writeFileSync(path.join(tmpDir, "c.csv"), "ignored");

      const result = parseInput(tmpDir);

      expect(result.files).toStrictEqual([]);
    });
  });
});
