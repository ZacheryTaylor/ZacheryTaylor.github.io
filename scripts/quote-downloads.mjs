/*
  QUOTE BANK DOWNLOADS — generated at build time (eleventy.after) into
  _site/downloads/: quote-bank.pdf, quote-bank.csv, quote-bank.txt.
  Always the full bank from src/assets/js/quotes-data.js, so they stay in sync.
  The PDF uses the site's fonts (Instrument Serif + DM Sans from @fontsource)
  and palette; static files download reliably everywhere, including iOS Safari.
*/
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import PDFDocument from "pdfkit";
import { loadQuoteBank } from "../src/_lib/validate-quotes.js";

const require = createRequire(import.meta.url);
const font = (pkg, file) => path.join(path.dirname(require.resolve(`${pkg}/package.json`)), "files", file);
const FONTS = {
  serif: font("@fontsource/instrument-serif", "instrument-serif-latin-400-normal.woff"),
  serifItalic: font("@fontsource/instrument-serif", "instrument-serif-latin-400-italic.woff"),
  sans: font("@fontsource/dm-sans", "dm-sans-latin-400-normal.woff"),
  sansBold: font("@fontsource/dm-sans", "dm-sans-latin-700-normal.woff"),
};
const C = { ink: "#0f1419", muted: "#4a5560", grey: "#6b7680", blue: "#0a4f9c", bronze: "#86612a", rule: "#d9d4c7", grid: "#e9eef4", paper: "#f7f5ef" };
const N1 = "M10.27 17.5L56.27 17.5L56.27 23.5L48.57 23.5L48.57 46.5L41.97 46.5L41.97 23.5L32.77 23.5L19.02 40.5L32.77 40.5L32.77 46.5L10.27 46.5L10.27 40.5L24.03 23.5L10.27 23.5Z";

const anchor = (id) => "q-" + String(id).replace(/^q/i, "");
const splitOrigin = (o) => { const i = o.indexOf(", "); return i === -1 ? { who: o, what: "" } : { who: o.slice(0, i), what: o.slice(i + 2) }; };
const years = (qs) => { const y = qs.map((q) => String(q.date || "").slice(0, 4)).filter((s) => /^\d{4}$/.test(s)).sort(); return y.length ? (y[0] === y[y.length - 1] ? y[0] : `${y[0]}–${y[y.length - 1]}`) : ""; };

export function quoteGroups(all) {
  const map = new Map();
  all.forEach((q) => { if (!map.has(q.origin)) map.set(q.origin, []); map.get(q.origin).push(q); });
  return [...map.entries()]
    .map(([origin, qs]) => ({ origin, qs, ...splitOrigin(origin) }))
    .sort((a, b) => (a.origin === "UNKNOWN") - (b.origin === "UNKNOWN") || b.qs.length - a.qs.length || a.origin.localeCompare(b.origin));
}

function csv(all, deckUrl) {
  const esc = (v) => { const s = String(v ?? ""); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const rows = [["id", "quote", "source", "date", "tags", "favorite", "link"]];
  all.forEach((q) => rows.push([q.id, q.quote, q.origin, q.date, (q.tags || []).join("; "), q.favorite ? "yes" : "", `${deckUrl}#${anchor(q.id)}`]));
  return "\uFEFF" + rows.map((r) => r.map(esc).join(",")).join("\r\n") + "\r\n"; // BOM so Excel reads UTF-8
}

function txt(all, groups, meta) {
  const out = [`THE QUOTE BANK — ${meta.author}`, `${all.length} quotes copied by hand, ${meta.range}. Generated ${meta.date}.`, meta.deckUrl, ""];
  groups.forEach((g) => {
    out.push("", "=".repeat(64), g.origin.toUpperCase(), `${g.qs.length} ${g.qs.length === 1 ? "quote" : "quotes"}`, "=".repeat(64), "");
    g.qs.forEach((q) => {
      out.push(`\u201C${q.quote}\u201D`);
      out.push(`  — ${q.id} · ${q.date || "undated"}${q.tags && q.tags.length ? " · " + q.tags.join(", ") : ""}${q.favorite ? " · ★ favorite" : ""}`, "");
    });
  });
  return out.join("\n") + "\n";
}

function pdf(all, groups, meta, file) {
  return new Promise((resolve, reject) => {
    const M = 54; // 0.75in margins
    const doc = new PDFDocument({ size: "LETTER", margins: { top: M + 18, bottom: M + 22, left: M + 6, right: M + 6 }, bufferPages: true,
      info: { Title: "The Quote Bank — Zachery Taylor", Author: meta.author, Subject: `${all.length} quotes copied by hand`, Keywords: "quotes, reading, books" } });
    const stream = fs.createWriteStream(file);
    doc.pipe(stream); stream.on("finish", resolve); stream.on("error", reject);
    doc.registerFont("serif", FONTS.serif); doc.registerFont("serif-i", FONTS.serifItalic);
    doc.registerFont("sans", FONTS.sans); doc.registerFont("sans-b", FONTS.sansBold);
    const W = doc.page.width, H = doc.page.height, L = doc.page.margins.left, R = W - doc.page.margins.right, CW = R - L;
    const star = (cx, cy, r, color = C.bronze) => {
      const pts = [];
      for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? r * 0.45 : r; pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); }
      doc.save().polygon(...pts).fill(color).restore();
    };
    const mark = (x, y, size, color = C.blue) => { doc.save().translate(x, y).scale(size / 46).translate(-10.27, -17.5).path(N1).fill(color).restore(); };

    // ---- cover: drawing-sheet style (drawn edge to edge, so no bottom margin)
    const coverBottom = doc.page.margins.bottom; doc.page.margins.bottom = 0;
    doc.save().rect(0, 0, W, H).fill(C.paper).restore();
    doc.save().lineWidth(0.4).strokeColor(C.grid);
    for (let x = M; x <= W - M; x += 18) doc.moveTo(x, M).lineTo(x, H - M);
    for (let y = M; y <= H - M; y += 18) doc.moveTo(M, y).lineTo(W - M, y);
    doc.stroke().restore();
    doc.save().lineWidth(1.6).strokeColor(C.ink).rect(M, M, W - 2 * M, H - 2 * M).stroke().restore();
    mark(L + 18, 150, 74);
    doc.font("sans-b").fontSize(9).fillColor(C.blue).text("L-310 · READING & QUOTES", L + 18, 228, { characterSpacing: 1.6 });
    doc.font("serif").fontSize(58).fillColor(C.ink).text("The Quote Bank", L + 18, 250);
    doc.font("serif-i").fontSize(30).fillColor(C.bronze).text("Lines worth copying by hand.", L + 18, 316);
    doc.font("sans").fontSize(12).fillColor(C.muted).text(`${all.length} quotes from ${groups.length} sources, logged ${meta.range}. Grouped by source, most-quoted first; each entry keeps its id, date and tags.`, L + 18, 370, { width: CW - 80, lineGap: 3 });
    star(L + 23, 432, 5);
    doc.font("sans").fontSize(10).fillColor(C.muted).text(`marks one of the ${all.filter((q) => q.favorite).length} favorites.`, L + 34, 426);
    // title block
    const tbY = H - M - 96, tbX = M, tbW = W - 2 * M;
    doc.save().lineWidth(1.2).strokeColor(C.ink).moveTo(tbX, tbY).lineTo(tbX + tbW, tbY).stroke();
    const cols = [["DRAWN BY", "Zachery Taylor, EI"], ["PROJECT", "The quote bank"], ["DATE", meta.date], ["SHEET", "L-310"]];
    const cw = tbW / cols.length;
    cols.forEach(([k, v], i) => {
      if (i) doc.moveTo(tbX + i * cw, tbY).lineTo(tbX + i * cw, tbY + 96).stroke();
      doc.font("sans-b").fontSize(7.5).fillColor(C.grey).text(k, tbX + i * cw + 14, tbY + 22, { characterSpacing: 1.2 });
      doc.font(i === 3 ? "serif" : "sans-b").fontSize(i === 3 ? 26 : 11).fillColor(i === 3 ? C.blue : C.ink).text(v, tbX + i * cw + 14, tbY + (i === 3 ? 38 : 40), { width: cw - 24 });
    });
    doc.restore();
    doc.font("sans").fontSize(8).fillColor(C.grey).text(meta.deckUrl, tbX + 14, tbY - 16, { link: meta.deckUrl, width: tbW - 28 });

    doc.page.margins.bottom = coverBottom;
    // ---- contents (filled in after the body is laid out)
    doc.addPage();
    const tocPage = doc.bufferedPageRange().count - 1;
    const TOC_ROW = 21, TOC_FIRST = 26, TOC_MORE = 30;
    const tocPages = 1 + Math.max(0, Math.ceil((groups.length - TOC_FIRST) / TOC_MORE));
    for (let i = 1; i < tocPages; i++) doc.addPage();

    // ---- body
    const starts = [];
    const bottom = () => H - doc.page.margins.bottom;
    const quoteHeight = (q) => { doc.font("serif").fontSize(13.5); const h = doc.heightOfString(`\u201C${q.quote}\u201D`, { width: CW - 16, lineGap: 2 }); return h + 26; };
    groups.forEach((g, gi) => {
      // a new source starts a new page unless there's comfortable room left on this one
      if (gi === 0 || doc.y > bottom() - 190) doc.addPage(); else doc.y += 30;
      starts.push(doc.bufferedPageRange().count);
      doc.font("sans-b").fontSize(8).fillColor(C.blue).text(`SOURCE ${String(gi + 1).padStart(2, "0")} OF ${groups.length}`, L, doc.y, { characterSpacing: 1.4 });
      doc.moveDown(0.4);
      doc.font("serif").fontSize(28).fillColor(C.ink).text(g.what || g.who, L, doc.y, { width: CW, lineGap: 1 });
      if (g.what) doc.font("serif-i").fontSize(16).fillColor(C.bronze).text(g.who, L, doc.y + 2, { width: CW });
      doc.moveDown(0.3);
      doc.font("sans-b").fontSize(8).fillColor(C.grey).text(`${g.qs.length} ${g.qs.length === 1 ? "QUOTE" : "QUOTES"}${years(g.qs) ? " · LOGGED " + years(g.qs) : ""}`, L, doc.y, { characterSpacing: 1.2 });
      const ry = doc.y + 8;
      doc.save().lineWidth(1.4).strokeColor(C.blue).moveTo(L, ry).lineTo(L + 60, ry).stroke().lineWidth(0.6).strokeColor(C.rule).moveTo(L + 60, ry).lineTo(R, ry).stroke().restore();
      doc.y = ry + 16;
      g.qs.forEach((q) => {
        const h = quoteHeight(q);
        if (doc.y + h > bottom()) doc.addPage();
        const y0 = doc.y;
        if (q.favorite) star(L - 10, y0 + 7, 4.6);
        doc.save().lineWidth(1).strokeColor(q.favorite ? C.bronze : C.rule).moveTo(L, y0 + 2).lineTo(L, y0 + h - 16).stroke().restore();
        doc.font("serif").fontSize(13.5).fillColor(C.ink).text(`\u201C${q.quote}\u201D`, L + 12, y0, { width: CW - 16, lineGap: 2 });
        const metaLine = [q.id.toUpperCase(), q.date || "undated", ...(q.tags || [])].join("  ·  ");
        doc.font("sans").fontSize(7.5).fillColor(C.grey).text(metaLine, L + 12, doc.y + 3, { width: CW - 16, characterSpacing: 0.6, link: `${meta.deckUrl}#${anchor(q.id)}` });
        doc.y += 12;
      });
    });

    // ---- contents
    doc.switchToPage(tocPage);
    doc.font("sans-b").fontSize(8).fillColor(C.blue).text("CONTENTS", L, doc.page.margins.top, { characterSpacing: 1.4 });
    doc.font("serif").fontSize(30).fillColor(C.ink).text("Sources", L, doc.page.margins.top + 14, { lineBreak: false });
    doc.font("sans-b").fontSize(7.5).fillColor(C.grey).text("PAGE", R - 40, doc.page.margins.top + 44, { width: 40, align: "right", characterSpacing: 1, lineBreak: false });
    doc.y = doc.page.margins.top + 62;
    groups.forEach((g, i) => {
      if (i === TOC_FIRST || (i > TOC_FIRST && (i - TOC_FIRST) % TOC_MORE === 0)) { doc.switchToPage(tocPage + 1 + Math.floor((i - TOC_FIRST) / TOC_MORE)); doc.y = doc.page.margins.top; }
      const y = doc.y, title = g.what || g.who;
      doc.font("serif").fontSize(13).fillColor(C.ink);
      const tw = Math.min(doc.widthOfString(title), CW - 230);
      doc.text(title, L, y, { width: CW - 230, lineBreak: false, ellipsis: true });
      if (g.what) doc.font("sans").fontSize(8.5).fillColor(C.bronze).text(g.who, L + tw + 10, y + 4, { width: CW - 90 - tw - 10, lineBreak: false, ellipsis: true });
      doc.font("sans").fontSize(8.5).fillColor(C.grey).text(`${g.qs.length}`, R - 70, y + 4, { width: 30, align: "right", lineBreak: false });
      doc.font("sans-b").fontSize(9).fillColor(C.blue).text(String(starts[i]), R - 30, y + 3.5, { width: 30, align: "right", lineBreak: false });
      doc.save().lineWidth(0.4).strokeColor(C.rule).moveTo(L, y + 17).lineTo(R, y + 17).stroke().restore();
      doc.y = y + TOC_ROW;
    });
    doc.font("sans").fontSize(7.5).fillColor(C.grey).text("QUOTES", R - 90, doc.page.margins.top + 44, { width: 50, align: "right", characterSpacing: 1, lineBreak: false });

    // ---- running header/footer on every page except the cover
    const n = doc.bufferedPageRange().count;
    for (let i = 1; i < n; i++) {
      doc.switchToPage(i);
      const keep = doc.page.margins.bottom;
      doc.page.margins.bottom = 0; // drawing in the margin must not trigger a new page
      const fy = H - M + 2;
      doc.save().lineWidth(0.6).strokeColor(C.rule).moveTo(L, fy - 8).lineTo(R, fy - 8).stroke().restore();
      mark(L, fy - 1, 14);
      doc.font("sans-b").fontSize(7.5).fillColor(C.grey).text("THE QUOTE BANK · ZACHERY TAYLOR", L + 20, fy, { characterSpacing: 1, lineBreak: false });
      doc.font("sans-b").fontSize(7.5).fillColor(C.grey).text(`L-310 · ${i + 1} / ${n}`, R - 120, fy, { width: 120, align: "right", characterSpacing: 1, lineBreak: false });
      doc.page.margins.bottom = keep;
    }
    doc.end();
  });
}

export async function buildQuoteDownloads(outDir, { deckUrl, date, author = "Zachery Taylor" }) {
  const all = loadQuoteBank();
  const groups = quoteGroups(all);
  const meta = { deckUrl, date, author, range: years(all) };
  const dir = path.join(outDir, "downloads");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "quote-bank.csv"), csv(all, deckUrl));
  fs.writeFileSync(path.join(dir, "quote-bank.txt"), txt(all, groups, meta));
  await pdf(all, groups, meta, path.join(dir, "quote-bank.pdf"));
  return { count: all.length, groups: groups.length };
}
