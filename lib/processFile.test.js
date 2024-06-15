import { describe, expect, test } from "vitest";
import { parseMdFile, parseTxtFile } from "./processFile.js";

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
});
