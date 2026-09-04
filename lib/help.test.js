import { expect, test, vi } from "vitest";
import { getHelp } from "./help.js";

test("getHelp logs a usage message describing all options", () => {
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  getHelp();

  expect(logSpy).toHaveBeenCalledOnce();
  const message = logSpy.mock.calls[0][0];
  expect(message).toContain("Usage: static-dodo [options]");
  expect(message).toContain("-i, --input");
  expect(message).toContain("-s, --stylesheet");
  expect(message).toContain("-c, --config");
  expect(message).toContain("-v, --version");
  expect(message).toContain("-h, --help");

  logSpy.mockRestore();
});
