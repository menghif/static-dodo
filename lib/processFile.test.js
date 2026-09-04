import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import process from "process";
import hljs from "highlight.js";
import { parseMdFile, parseTxtFile, processFile } from "./processFile.js";

describe("Remove title from parsed text", () => {
  test("parseMdFile should remove the first line (title)", () => {
    const mdText = `# Title
Line one
Line two`;
    expect(parseMdFile(mdText)).toBe(`
<p>Line one
Line two</p>
`);
  });

  test("parseTxtFile should remove the first line (title)", () => {
    const txtText = `Title

Line one
Line two`;
    expect(parseTxtFile(txtText)).toBe(`
 <p>Line one Line two</p>
`);
  });

  test("parseTxtFile joins every hard-wrapped line in a paragraph, not just the first", () => {
    const txtText = `Title

Line one
Line two
Line three`;
    expect(parseTxtFile(txtText)).toBe(`
 <p>Line one Line two Line three</p>
`);
  });
});

describe("parseMdFile code highlighting", () => {
  test("fenced code block without a language is left unhighlighted", () => {
    const mdText = `# Title
\`\`\`
const x = 1;
\`\`\``;
    const html = parseMdFile(mdText);
    expect(html).toContain("<pre><code>");
    expect(html).toContain("const x = 1;");
  });

  test("fenced code block with an unknown language is left unhighlighted", () => {
    const mdText = `# Title
\`\`\`not-a-real-language
const x = 1;
\`\`\``;
    const html = parseMdFile(mdText);
    expect(html).toContain('class="language-not-a-real-language"');
    expect(html).toContain("const x = 1;");
  });

  test("fenced code block with a known language is highlighted", () => {
    const mdText = `# Title
\`\`\`js
const x = 1;
\`\`\``;
    const html = parseMdFile(mdText);
    expect(html).toContain("hljs-keyword");
  });

  test("a highlighting failure is logged and falls back to no highlighting", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const highlightSpy = vi
      .spyOn(hljs, "highlight")
      .mockImplementationOnce(() => {
        throw new Error("boom");
      });

    const mdText = `# Title
\`\`\`js
const x = 1;
\`\`\``;
    const html = parseMdFile(mdText);

    expect(errorSpy).toHaveBeenCalledWith(
      "Error highlighting code:",
      expect.any(Error),
    );
    expect(html).toContain("<pre><code");
    expect(html).not.toContain("hljs-keyword");

    highlightSpy.mockRestore();
    errorSpy.mockRestore();
  });
});

describe("processFile", () => {
  let tmpDir;
  let cwdSpy;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "static-dodo-process-"));
    fs.mkdirSync(path.join(tmpDir, "dist"));
    cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(tmpDir);
  });

  afterEach(() => {
    cwdSpy.mockRestore();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test("writes a .txt file to an html file with the first line as title", () => {
    const fileName = "sample.txt";
    fs.writeFileSync(
      path.join(tmpDir, fileName),
      "My Title\n\nFirst paragraph.",
    );

    processFile(fileName, tmpDir, undefined);

    const output = fs.readFileSync(
      path.join(tmpDir, "dist", "sample.html"),
      "utf-8",
    );
    expect(output).toContain("<title>My Title</title>");
    expect(output).toContain("<h1>My Title</h1>");
    expect(output).toContain("First paragraph.");
  });

  test("writes a .md file to an html file with a clean title and the given stylesheet", () => {
    const fileName = "sample.md";
    fs.writeFileSync(
      path.join(tmpDir, fileName),
      "# My Title\n\nSome **bold** text.",
    );

    processFile(fileName, tmpDir, "https://example.com/style.css");

    const output = fs.readFileSync(
      path.join(tmpDir, "dist", "sample.html"),
      "utf-8",
    );
    expect(output).toContain("<title>My Title</title>");
    expect(output).toContain("<h1>My Title</h1>");
    expect(output).toContain(
      '<link rel="stylesheet" href="https://example.com/style.css">',
    );
    expect(output).toContain("<strong>bold</strong>");
  });

  test("does not treat a file that merely ends in the letters txt as a real .txt file", () => {
    const fileName = "report_txt";
    fs.writeFileSync(path.join(tmpDir, fileName), "Title\n\nBody text.");

    processFile(fileName, tmpDir, undefined);

    const output = fs.readFileSync(
      path.join(tmpDir, "dist", "report_txt.html"),
      "utf-8",
    );
    expect(output).not.toContain("Body text.");
  });

  test("reads the file from the given currentDir, independent of process.cwd()", () => {
    const sourceDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "static-dodo-source-"),
    );
    const fileName = "elsewhere.txt";
    fs.writeFileSync(path.join(sourceDir, fileName), "Title\n\nBody text.");

    processFile(fileName, sourceDir, undefined);

    const output = fs.readFileSync(
      path.join(tmpDir, "dist", "elsewhere.html"),
      "utf-8",
    );
    expect(output).toContain("Body text.");

    fs.rmSync(sourceDir, { recursive: true, force: true });
  });
});
