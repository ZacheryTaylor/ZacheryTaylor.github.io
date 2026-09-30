/*
  Loads the browser-style data files in src/assets/js/*-data.js
  (e.g. `const projects = [...]`) so the build can use them directly.
  Those files stay the single place to edit content.
*/
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export function loadDataFile(file, name) {
  const code = fs.readFileSync(path.join("src/assets/js", file), "utf8");
  try {
    return vm.runInNewContext(`${code}\n;(${name});`, {}, { filename: file });
  } catch (e) {
    // A typo in a data file: say where, in plain words, and stop the build
    // (the published site keeps its last good version).
    const line = (String(e.stack).match(new RegExp(file.replace(/\./g, "\\.") + ":(\\d+)")) || [])[1];
    throw new Error(
      `${file} has a typo${line ? ` near line ${line}` : ""}: ${e.message}.\n` +
      `  Usual causes: a missing comma between two entries ("},{"), a missing closing " on a line,\n` +
      `  or a straight " inside the quote text (write it as \\" or use curly quotes “ ”).\n` +
      `  Nothing was published; fix it and commit again.`
    );
  }
}

export const fileExists = (p) => !!p && fs.existsSync(path.join("src", p));
