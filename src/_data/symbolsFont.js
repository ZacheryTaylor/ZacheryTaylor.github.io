// ZT Symbols: the tiny symbols font (see src/assets/fonts-src/README-zt-symbols.txt),
// inlined as base64 so partials/head.njk can register it synchronously before first layout.
import fs from "node:fs";
export default {
  family: "ZT Symbols",
  unicodeRange: "U+0394,U+2190,U+2192-2193,U+21B3,U+25B8,U+25C2,U+2605",
  base64: fs.readFileSync(new URL("../assets/fonts-src/zt-symbols.woff2", import.meta.url)).toString("base64"),
};
