/**
 * deck_lib.js — house-style helpers for building paper-presentation decks with pptxgenjs.
 *
 * Usage (from a per-paper build script):
 *   const { createDeck } = require("<skill>/scripts/deck_lib.js");
 *   const d = createDeck({ out: "Paper_deck.pptx", assets: "assets/manifest.json" });  // manifest optional
 *   const s = d.slide();                      // CONTENT layout
 *   d.title(s, "One sentence.");
 *   d.img(s, "icon-bug", 1, 2, 1, 1);         // picture if the slug is in the manifest, else a labelled placeholder
 *   d.anim(s, [[["stat-7-8", "zoom"]], [["icon-bug", "fade"], ["lbl", "wipe", "bottom"]]]);   // clicks
 *   await d.finalize({ morph: [3,4,5], fade: [2] });
 *   // then: python3 <skill>/scripts/postprocess.py Paper_deck.pptx --plan Paper_deck.plan.json -o Paper_deck.final.pptx
 *
 * Requires pptxgenjs and jszip resolvable from NODE_PATH (see SKILL.md "Setup").
 * Everything here is deterministic layout plumbing; the content decisions live in the build script.
 */
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

// House palette (references/visual-style.md)
const PALETTE = {
  SLATE: "4A6FA5", SAGE: "8FAF9A", LIGHT: "CFE3F0", CHAR: "2E3A46",
  RED: "E63946", GREEN: "4CAF7A", GREY: "9AA5B1", WHITE: "FFFFFF", PALE: "EEF3F8", PINK: "FBE3E5", MINT: "DDF1E5",
};

const EFFECTS = new Set(["appear", "fade", "wipe", "fly", "zoom", "pulse"]);
const DIRS = new Set(["top", "bottom", "left", "right"]);

function createDeck(opts = {}) {
  const out = opts.out || "deck.pptx";
  const C = { ...PALETTE, ...(opts.palette || {}) };
  const fonts = { head: opts.headFont || "Calibri", body: opts.bodyFont || "Calibri" };

  let manifest = {};
  let assetDir = null;
  if (opts.assets && fs.existsSync(opts.assets)) {
    manifest = JSON.parse(fs.readFileSync(opts.assets, "utf8"));
    assetDir = path.dirname(path.resolve(opts.assets));
  }

  const THEME = {
    name: opts.themeName || "Paper presentation",
    headFontFace: fonts.head, bodyFontFace: fonts.body,
    colors: { dk1: C.CHAR, lt1: C.WHITE, dk2: C.SLATE, lt2: C.LIGHT, accent1: C.SLATE, accent2: C.SAGE,
              accent3: C.RED, accent4: C.GREEN, accent5: C.GREY, accent6: C.LIGHT, hlink: C.SLATE, folHlink: C.SAGE },
  };

  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
  pres.theme = { headFontFace: fonts.head, bodyFontFace: fonts.body };
  if (opts.author) pres.author = opts.author;
  if (opts.title) pres.title = opts.title;

  const W = 13.33, H = 7.5;
  const TITLE = { name: "title", type: "title", x: 0.5, y: 0.35, w: 10.9, h: 1.45, fontSize: 26, bold: true,
                  color: C.CHAR, align: "left", valign: "top", margin: 0 };
  pres.defineSlideMaster({ title: "TITLE", background: { color: C.WHITE },
    objects: [{ placeholder: { options: { ...TITLE, w: 6.2, h: 2.4, y: 1.4, fontSize: 32 } } }] });
  pres.defineSlideMaster({ title: "CONTENT", background: { color: C.WHITE },
    objects: [{ placeholder: { options: { ...TITLE } } }],
    slideNumber: { x: 12.35, y: 7.05, w: 0.6, h: 0.3, fontSize: 11, color: C.GREY, align: "right", fontFace: fonts.body } });
  pres.defineSlideMaster({ title: "DIVIDER", background: { color: C.LIGHT },
    objects: [{ placeholder: { options: { ...TITLE, y: 2.9, w: 12.3, h: 1.6, fontSize: 36, align: "center" } } }] });

  const section = opts.section || "Deck";
  pres.addSection({ title: section });

  // ---- per-slide bookkeeping (object names must be unique per slide for animation targeting) ----
  const slides = [];               // { slide, names:Set, anims:[] }
  const plan = { animations: {}, transitions: {} };
  let current = null;

  function uniqueName(base) {
    let n = base, i = 2;
    while (current.names.has(n)) n = `${base}-${i++}`;
    current.names.add(n);
    return n;
  }

  function slide(master = "CONTENT", sectionTitle = section) {
    const s = pres.addSlide({ masterName: master, sectionTitle });
    current = { slide: s, names: new Set(), index: slides.length + 1 };
    slides.push(current);
    return s;
  }
  function title(s, text) { s.addText(text, { placeholder: "title" }); }

  // ---- primitives ----
  function label(s, text, x, y, w, h, o = {}) {
    const name = uniqueName(o.name || ("lbl " + String(text).slice(0, 24)));
    s.addText(text, { x, y, w, h, isTextBox: true, margin: 0, fontSize: o.fontSize || 12,
      color: o.color || C.GREY, align: o.align || "center", valign: o.valign || "top",
      italic: !!o.italic, bold: !!o.bold, strike: !!o.strike, objectName: name });
    return name;
  }
  function big(s, text, x, y, w, h, o = {}) {
    const name = uniqueName(o.name || ("stat " + text));
    s.addText(text, { x, y, w, h, isTextBox: true, margin: 0, fontSize: o.size || 64, bold: true,
      color: o.color || C.CHAR, align: "center", valign: "middle", objectName: name });
    return name;
  }
  function box(s, x, y, w, h, o = {}) {
    const name = uniqueName(o.name || "box");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: o.radius ?? 0.08,
      fill: { color: o.fill || C.PALE },
      line: o.line ? { color: o.line, width: o.lineW || 1, dashType: o.dash || "solid" } : { color: o.fill || C.PALE, width: 0 },
      objectName: name });
    return name;
  }
  function textBox(s, text, x, y, w, h, o = {}) {
    const name = uniqueName(o.name || ("tb " + String(typeof text === "string" ? text : "runs").slice(0, 24)));
    s.addText(text, { shape: o.shape || pres.shapes.ROUNDED_RECTANGLE, rectRadius: o.radius ?? 0.08, x, y, w, h,
      fill: { color: o.fill || C.LIGHT }, line: { color: o.line || C.SLATE, width: o.lineW || 1, dashType: o.dash || "solid" },
      fontSize: o.fontSize || 14, color: o.color || C.CHAR, align: o.align || "center", valign: o.valign || "middle",
      margin: o.margin ?? 0.1, bold: !!o.bold, italic: !!o.italic, objectName: name });
    return name;
  }
  function arrow(s, dir, x, y, w, h, o = {}) {
    const shape = { right: pres.shapes.RIGHT_ARROW, left: pres.shapes.LEFT_ARROW, up: pres.shapes.UP_ARROW, down: pres.shapes.DOWN_ARROW }[dir];
    const name = uniqueName(o.name || ("arrow-" + dir));
    s.addShape(shape, { x, y, w, h, fill: { color: o.color || C.SLATE }, line: { color: o.color || C.SLATE }, objectName: name });
    return name;
  }
  function line(s, x, y, w, h, o = {}) {
    const name = uniqueName(o.name || "line");
    s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: o.color || C.GREY, width: o.width || 2 }, objectName: name });
    return name;
  }
  // dashed placeholder carrying the asset slug as text
  function ph(s, slug, x, y, w, h, o = {}) {
    const name = uniqueName(o.name || slug);
    s.addText(o.text || `[${slug}]`, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x, y, w, h,
      fill: { color: o.fill || C.PALE }, line: { color: o.line || C.GREY, width: 1, dashType: "dash" },
      fontSize: o.fontSize || Math.max(6, Math.min(11, Math.round(w * 6))), color: o.color || C.CHAR, align: "center", valign: "middle",
      margin: 0.05, objectName: name });
    return name;
  }
  // picture if the slug is in the manifest, else placeholder. Aspect preserved, centred in the box.
  function img(s, slug, x, y, w, h, o = {}) {
    const m = manifest[slug];
    if (!m) return ph(s, slug, x, y, w, h, o);
    const r = Math.min(w / m.w, h / m.h);
    const iw = m.w * r, ih = m.h * r;
    const name = uniqueName(o.name || slug);
    const io = { path: path.join(assetDir, m.file), x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih, objectName: name };
    if (o.transparency) io.transparency = o.transparency;
    s.addImage(io);
    return name;
  }
  function note(s, lines) { s.addNotes(Array.isArray(lines) ? lines.join("\n") : String(lines)); }

  // ---- tables and charts with house defaults ----
  const cell = (text, o = {}) => ({ text, options: { fontSize: 10, color: C.CHAR, align: "center", valign: "middle", ...o } });
  const hdr = (text, o = {}) => cell(text, { bold: true, fill: { color: C.LIGHT }, ...o });
  const ok = () => cell("✓", { color: C.GREEN, bold: true, fontSize: 14 });
  const bad = () => cell("✗", { color: C.RED, bold: true, fontSize: 13, fill: { color: C.PINK } });
  const ns = () => cell("○", { color: C.GREY, fontSize: 13 });
  function table(s, rows, x, y, w, o = {}) {
    const name = uniqueName(o.name || "table");
    s.addTable(rows, { x, y, w, colW: o.colW, rowH: o.rowH || 0.42, border: { type: "solid", color: C.GREY, pt: 0.75 },
      fontSize: o.fontSize || 10, color: C.CHAR, valign: "middle", objectName: name });
    return name;
  }
  function barChart(s, labels, values, x, y, w, h, o = {}) {
    const name = uniqueName(o.name || "chart");
    const colors = o.colors || [C.SLATE];
    s.addChart(pres.charts.BAR, [{ name: o.series || "value", labels, values }], {
      x, y, w, h, barDir: o.horizontal ? "bar" : "col", chartColors: colors,
      showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: o.format || "0.0", dataLabelFontSize: o.labelSize || 11,
      dataLabelColor: C.CHAR, dataLabelFontFace: "+mn-lt",
      catAxisLabelColor: C.CHAR, catAxisLabelFontSize: o.labelSize || 11, catAxisLabelFontFace: "+mn-lt",
      valAxisLabelColor: C.GREY, valAxisLabelFontSize: 10, valAxisLabelFontFace: "+mn-lt",
      valGridLine: { color: "E6EAEE", size: 0.5 }, catGridLine: { style: "none" }, valAxisLineShow: false, showLegend: false,
      valAxisMaxVal: o.max, showTitle: !!o.title, title: o.title || "", titleFontSize: 11, titleColor: C.CHAR, titleFontFace: "+mn-lt",
      objectName: name });
    return name;
  }

  // ---- agenda / tracker / badge pattern (Morph keys on identical names across slides) ----
  let points = [];
  const ROW = { y: 2.55, size: 1.5, x0: 1.115, step: 2.4 };
  const STRIP = { y: 6.5, size: 0.55, x0: 4.59, step: 0.9 };
  const BADGE = { x: 11.75, y: 0.35, size: 1.15 };
  function setPoints(list) {
    // list: [{ slug, label, mark: "✓"|"✗"|"→", markColor }]
    points = list;
    const n = list.length;
    ROW.step = n > 1 ? Math.min(2.4, (W - 2 * 1.1 - ROW.size) / (n - 1)) : 0;
    ROW.x0 = (W - (ROW.size + (n - 1) * ROW.step)) / 2;
    STRIP.x0 = (W - (STRIP.size + (n - 1) * STRIP.step)) / 2;
  }
  function mark(s, p, x, y, size) {
    s.addText(p.mark || "✓", { x: x + size * 0.62, y: y - size * 0.18, w: size * 0.55, h: size * 0.55, isTextBox: true, margin: 0,
      fontSize: Math.max(12, Math.round(size * 18)), bold: true, color: p.markColor || C.RED, align: "center", valign: "middle",
      objectName: uniqueName("mark-" + p.slug) });
  }
  function agendaRow(s, o = {}) {
    points.forEach((p, i) => {
      const x = ROW.x0 + i * ROW.step;
      img(s, p.slug, x, ROW.y, ROW.size, ROW.size, { name: p.slug });
      label(s, p.label, x - 0.45, ROW.y + ROW.size + 0.15, ROW.size + 0.9, 0.5, { color: C.CHAR, fontSize: 14, name: "lbl-" + p.slug });
      if (o.marks) mark(s, p, x, ROW.y, ROW.size);
    });
  }
  function tracker(s, currentIdx, o = {}) {
    points.forEach((p, i) => {
      if (i === currentIdx) { img(s, p.slug, BADGE.x, BADGE.y, BADGE.size, BADGE.size, { name: p.slug }); return; }
      const x = STRIP.x0 + i * STRIP.step;
      const covered = i < currentIdx;
      img(s, p.slug, x, STRIP.y, STRIP.size, STRIP.size, { name: p.slug, transparency: covered ? 0 : (o.fade ?? 65) });
      if (covered) mark(s, p, x, STRIP.y, STRIP.size);
    });
    label(s, points[currentIdx].label, BADGE.x - 0.4, BADGE.y + BADGE.size + 0.05, BADGE.size + 0.8, 0.3,
      { color: C.SLATE, fontSize: 11, bold: true, name: "badge-label" });
  }

  // ---- animation plan: clicks → [[name, effect, dir?], ...] ----
  function anim(s, clicks) {
    const idx = current.index;
    const norm = clicks.map(click => click.map(step => {
      const [name, effect = "fade", dir] = step;
      if (!EFFECTS.has(effect)) throw new Error(`unknown effect "${effect}" (use ${[...EFFECTS].join("|")})`);
      if (dir && !DIRS.has(dir)) throw new Error(`unknown direction "${dir}"`);
      if (!current.names.has(name)) console.warn(`[deck_lib] slide ${idx}: animation target "${name}" is not an object on this slide`);
      return dir ? [name, effect, dir] : [name, effect];
    }));
    plan.animations[idx] = norm;
  }

  async function finalize(o = {}) {
    await pres.writeFile({ fileName: out });
    try {
      const { applyTheme } = require(path.join(__dirname, "apply_theme.js"));
      await applyTheme(out, THEME);
    } catch (e) { console.warn("[deck_lib] theme not applied:", e.message); }
    plan.transitions = { morph: o.morph || [], fade: o.fade || [] };
    const planPath = out.replace(/\.pptx$/i, "") + ".plan.json";
    fs.writeFileSync(planPath, JSON.stringify(plan, null, 1));
    console.log(`wrote ${out} and ${planPath}`);
    console.log(`next: python3 "${path.join(__dirname, "postprocess.py")}" "${out}" --plan "${planPath}" -o "${out.replace(/\.pptx$/i, "")}.final.pptx"`);
    return { out, planPath };
  }

  return { pres, C, W, H, shapes: pres.shapes, slide, title, label, big, box, textBox, arrow, line, ph, img, note,
           cell, hdr, ok, bad, ns, table, barChart, setPoints, agendaRow, tracker, mark, anim, finalize,
           hasAsset: (slug) => !!manifest[slug] };
}

module.exports = { createDeck, PALETTE };
