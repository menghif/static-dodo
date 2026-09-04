import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import process from "process";
import { fileURLToPath, pathToFileURL } from "url";

const scriptPath = fileURLToPath(new URL("./static-dodo.js", import.meta.url));

let tmpDir;
let originalCwd;
let originalArgv;
let logSpy;
let errorSpy;
let exitSpy;
let importCounter = 0;

function runCli(args) {
  process.argv = ["node", "static-dodo.js", ...args];
  const url = `${pathToFileURL(scriptPath).href}?t=${importCounter++}`;
  return import(url);
}

beforeEach(() => {
  originalCwd = process.cwd();
  originalArgv = process.argv;
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "static-dodo-cli-"));
  process.chdir(tmpDir);

  logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`process.exit: ${code}`);
  });
});

afterEach(() => {
  logSpy.mockRestore();
  errorSpy.mockRestore();
  exitSpy.mockRestore();
  process.argv = originalArgv;
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("--version", () => {
  test("prints the package's own version regardless of the current directory", async () => {
    // No package.json is placed in tmpDir on purpose: --version must report
    // static-dodo's own version, not whatever happens to be in the caller's
    // working directory (which usually has no package.json at all).
    const ownPackageJson = JSON.parse(
      fs.readFileSync(
        fileURLToPath(new URL("./package.json", import.meta.url)),
        "utf-8",
      ),
    );

    await expect(runCli(["--version"])).rejects.toThrow("process.exit: 0");

    expect(logSpy).toHaveBeenCalledWith(ownPackageJson.version);
  });
});

describe("--help", () => {
  test("prints the help message and exits 0", async () => {
    await expect(runCli(["--help"])).rejects.toThrow("process.exit: 0");

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Usage: static-dodo [options]"),
    );
  });
});

describe("no input or config provided", () => {
  test("prints help and exits 0 when called with no arguments", async () => {
    await expect(runCli([])).rejects.toThrow("process.exit: 0");

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Usage: static-dodo [options]"),
    );
  });

  test("reports unknown options and still prints help", async () => {
    await expect(runCli(["--bogus"])).rejects.toThrow("process.exit: 0");

    expect(errorSpy).toHaveBeenCalledWith("Option '--bogus' not found.");
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Usage: static-dodo [options]"),
    );
  });
});

describe("dist directory handling", () => {
  test("creates ./dist when it does not exist yet", async () => {
    fs.writeFileSync(path.join(tmpDir, "file.txt"), "Title\n\nBody.");

    await runCli(["--input", "file.txt"]);

    expect(fs.existsSync(path.join(tmpDir, "dist", "file.html"))).toBe(true);
  });

  test("replaces an existing ./dist directory", async () => {
    fs.mkdirSync(path.join(tmpDir, "dist"));
    fs.writeFileSync(path.join(tmpDir, "dist", "stale.html"), "stale");
    fs.writeFileSync(path.join(tmpDir, "file.txt"), "Title\n\nBody.");

    await runCli(["--input", "file.txt"]);

    expect(fs.existsSync(path.join(tmpDir, "dist", "stale.html"))).toBe(false);
    expect(fs.existsSync(path.join(tmpDir, "dist", "file.html"))).toBe(true);
  });

  test("exits -1 when the existing ./dist directory cannot be removed", async () => {
    fs.mkdirSync(path.join(tmpDir, "dist"));
    fs.writeFileSync(path.join(tmpDir, "file.txt"), "Title\n\nBody.");
    const rmSpy = vi.spyOn(fs, "rmSync").mockImplementationOnce(() => {
      throw new Error("EACCES");
    });

    await expect(runCli(["--input", "file.txt"])).rejects.toThrow(
      "process.exit: -1",
    );

    expect(errorSpy).toHaveBeenCalledWith("Unable to delete ./dist directory.");

    rmSpy.mockRestore();
  });

  test("exits -1 when ./dist cannot be created", async () => {
    fs.writeFileSync(path.join(tmpDir, "file.txt"), "Title\n\nBody.");
    const mkdirSpy = vi.spyOn(fs, "mkdirSync").mockImplementationOnce(() => {
      throw new Error("EACCES");
    });

    await expect(runCli(["--input", "file.txt"])).rejects.toThrow(
      "process.exit: -1",
    );

    expect(errorSpy).toHaveBeenCalledWith("Unable to create ./dist directory.");

    mkdirSpy.mockRestore();
  });
});

describe("processing input", () => {
  test("errors out and exits -1 when the input path does not exist", async () => {
    await expect(runCli(["--input", "missing.txt"])).rejects.toThrow(
      "process.exit: -1",
    );

    expect(errorSpy).toHaveBeenCalledWith("File or directory not found!");
    expect(fs.existsSync(path.join(tmpDir, "dist"))).toBe(false);
  });

  test("accepts an absolute directory path via --input", async () => {
    fs.mkdirSync(path.join(tmpDir, "posts"));
    fs.writeFileSync(path.join(tmpDir, "posts", "a.txt"), "A\n\nBody A.");

    await runCli(["--input", path.join(tmpDir, "posts")]);

    expect(fs.existsSync(path.join(tmpDir, "dist", "a.html"))).toBe(true);
  });

  test("processes a single file passed via --input", async () => {
    fs.writeFileSync(path.join(tmpDir, "file.txt"), "My Title\n\nBody text.");

    await runCli(["--input", "file.txt"]);

    const output = fs.readFileSync(
      path.join(tmpDir, "dist", "file.html"),
      "utf-8",
    );
    expect(output).toContain("<title>My Title</title>");
    expect(output).toContain("Body text.");
  });

  test("applies the --stylesheet option to the generated file", async () => {
    fs.writeFileSync(path.join(tmpDir, "file.txt"), "My Title\n\nBody text.");

    await runCli([
      "--input",
      "file.txt",
      "--stylesheet",
      "https://example.com/style.css",
    ]);

    const output = fs.readFileSync(
      path.join(tmpDir, "dist", "file.html"),
      "utf-8",
    );
    expect(output).toContain(
      '<link rel="stylesheet" href="https://example.com/style.css">',
    );
  });

  test("does nothing but still succeeds when no files match in the input directory", async () => {
    fs.mkdirSync(path.join(tmpDir, "empty"));
    fs.writeFileSync(path.join(tmpDir, "empty", "c.csv"), "ignored");

    await runCli(["--input", "empty"]);

    expect(fs.existsSync(path.join(tmpDir, "dist"))).toBe(true);
    expect(fs.readdirSync(path.join(tmpDir, "dist"))).toStrictEqual([]);
  });

  test("processes every matching file in a directory passed via --input", async () => {
    fs.mkdirSync(path.join(tmpDir, "posts"));
    fs.writeFileSync(path.join(tmpDir, "posts", "a.txt"), "A\n\nBody A.");
    fs.writeFileSync(path.join(tmpDir, "posts", "b.md"), "# B\n\nBody B.");
    fs.writeFileSync(path.join(tmpDir, "posts", "c.csv"), "ignored");

    await runCli(["--input", "posts"]);

    expect(fs.existsSync(path.join(tmpDir, "dist", "a.html"))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, "dist", "b.html"))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, "dist", "c.html"))).toBe(false);
  });

  test("--config overrides --input and applies its own stylesheet", async () => {
    fs.writeFileSync(path.join(tmpDir, "file.txt"), "My Title\n\nBody text.");
    fs.writeFileSync(
      path.join(tmpDir, "config.json"),
      JSON.stringify({
        input: "file.txt",
        stylesheet: "https://example.com/config.css",
      }),
    );

    await runCli(["--config", "config.json"]);

    const output = fs.readFileSync(
      path.join(tmpDir, "dist", "file.html"),
      "utf-8",
    );
    expect(output).toContain(
      '<link rel="stylesheet" href="https://example.com/config.css">',
    );
  });
});
