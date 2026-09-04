import { afterEach, beforeEach, expect, test, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import process from "process";
import { parseConfigFile } from "./config.js";

let tmpDir;
let mockExit;
let errorSpy;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "static-dodo-config-"));
  mockExit = vi.spyOn(process, "exit").mockImplementation((num) => {
    throw new Error("process.exit: " + num);
  });
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  mockExit.mockRestore();
  errorSpy.mockRestore();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test("config file name that is not a string should exit", () => {
  expect(() => {
    parseConfigFile(3);
  }).toThrow();
  expect(mockExit).toHaveBeenCalledWith(1);
});

test("config file name not ending in .json should exit", () => {
  expect(() => {
    parseConfigFile("config.txt");
  }).toThrow();
  expect(mockExit).toHaveBeenCalledWith(1);
});

test("config file that does not exist should exit", () => {
  const configPath = path.join(tmpDir, "missing.json");

  expect(() => {
    parseConfigFile(configPath);
  }).toThrow();
  expect(mockExit).toHaveBeenCalledWith(1);
  expect(errorSpy).toHaveBeenCalledWith("The file does not exist.");
});

test("config path that is not a regular file should exit", () => {
  const configDir = path.join(tmpDir, "folder.json");
  fs.mkdirSync(configDir);

  expect(() => {
    parseConfigFile(configDir);
  }).toThrow();
  expect(mockExit).toHaveBeenCalledWith(1);
  expect(errorSpy).toHaveBeenCalledWith(
    "This is not a regular input file. Please enter a text file. ",
  );
});

test("config file that cannot be read should exit", () => {
  const configPath = path.join(tmpDir, "config.json");
  fs.writeFileSync(configPath, "{}");
  const readSpy = vi.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
    throw new Error("boom");
  });

  expect(() => {
    parseConfigFile(configPath);
  }).toThrow();
  expect(mockExit).toHaveBeenCalledWith(1);
  expect(errorSpy).toHaveBeenCalledWith(
    "There has been an error while reading the file.",
  );

  readSpy.mockRestore();
});

test("config file with invalid JSON should exit", () => {
  const configPath = path.join(tmpDir, "invalid.json");
  fs.writeFileSync(configPath, "not json");

  expect(() => {
    parseConfigFile(configPath);
  }).toThrow();
  expect(mockExit).toHaveBeenCalledWith(1);
  expect(errorSpy).toHaveBeenCalledWith(
    "This file cannot be parsed as a JSON.",
  );
});

test("config file without an input field should exit", () => {
  const configPath = path.join(tmpDir, "no-input.json");
  fs.writeFileSync(configPath, JSON.stringify({ stylesheet: "style.css" }));

  expect(() => {
    parseConfigFile(configPath);
  }).toThrow();
  expect(mockExit).toHaveBeenCalledWith(1);
  expect(errorSpy).toHaveBeenCalledWith(
    "Please provide a path to a text file.",
  );
});

test("config file with only an input field returns input and undefined stylesheet", () => {
  const configPath = path.join(tmpDir, "input-only.json");
  fs.writeFileSync(configPath, JSON.stringify({ input: "file.txt" }));

  const result = parseConfigFile(configPath);

  expect(result).toEqual({ input: "file.txt", stylesheet: undefined });
  expect(mockExit).not.toHaveBeenCalled();
});

test("config file with input and stylesheet returns both", () => {
  const configPath = path.join(tmpDir, "full.json");
  fs.writeFileSync(
    configPath,
    JSON.stringify({ input: "file.md", stylesheet: "style.css" }),
  );

  const result = parseConfigFile(configPath);

  expect(result).toEqual({ input: "file.md", stylesheet: "style.css" });
  expect(mockExit).not.toHaveBeenCalled();
});
