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
  return vm.runInNewContext(`${code}\n;(${name});`, {}, { filename: file });
}

export const fileExists = (p) => !!p && fs.existsSync(path.join("src", p));
