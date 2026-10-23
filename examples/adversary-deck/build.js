// Worked example: adversary deck for Turzo, Sultana, Bosu, "From First Patch to Long-Term Contributor" (TSE 2025).
// Build:  NODE_PATH=<skill>/scripts/node_modules node build.js            (placeholders)
//         NODE_PATH=... node build.js --assets assets/manifest.json         (after crop_sheet.py)
// Then:   python3 <skill>/scripts/postprocess.py FirstPatch_adversary.pptx --plan FirstPatch_adversary.plan.json -o FirstPatch_adversary.final.pptx
const path = require("path");
const SKILL = path.resolve(__dirname, "..", "..");
const { createDeck } = require(path.join(SKILL, "scripts", "deck_lib.js"));

const assetsArg = process.argv.indexOf("--assets");
const d = createDeck({
  out: "FirstPatch_adversary.pptx",
  assets: assetsArg > -1 ? process.argv[assetsArg + 1] : path.join(__dirname, "assets", "manifest.json"),
  author: "Amber Wang", title: "From First Patch to Long-Term Contributor: the adversary's case", section: "Adversary case",
});
const C = d.C;

d.setPoints([
  { slug: "pt-holds",       label: "What holds",                mark: "✓", markColor: C.GREEN },
  { slug: "thr-construct",  label: "Construct validity",        mark: "✗", markColor: C.RED },
  { slug: "thr-internal",   label: "Internal validity",         mark: "✗", markColor: C.RED },
  { slug: "thr-conclusion", label: "Conclusion validity",       mark: "✗", markColor: C.RED },
  { slug: "pt-experiment",  label: "What would change my mind", mark: "→", markColor: C.SLATE },
]);

// ---------- 1 · Title ----------
{
  const s = d.slide("TITLE");
  d.title(s, "The adversary's case: the claims outrun the evidence");
  d.img(s, "hero-door", 6.9, 1.2, 5.9, 5.2);
  d.label(s, "Turzo, Sultana, Bosu · IEEE Transactions on Software Engineering 51(4), 2025", 0.5, 4.1, 6.2, 0.4, { align: "left", fontSize: 14 });
  d.label(s, "Adversary presentation · after the champions", 0.5, 4.55, 6.2, 0.4, { align: "left", fontSize: 14, italic: true });
  d.note(s, ["Static title; Fade into slide 2.", "Opening line: the champions showed what the paper found; I argue that what it claims is larger than what it measured."]);
}

// ---------- 2 · Agenda (Morph source) ----------
{
  const s = d.slide();
  d.title(s, "I will grant what holds, raise three threats to validity, and name the experiment that would change my mind");
  d.agendaRow(s);
  const bx = 1.115 + 2.4, bw = 2 * 2.4 + 1.5;
  d.label(s, "threats to validity", bx, 1.85, bw, 0.3, { color: C.SLATE, fontSize: 13, italic: true, name: "bracket-label" });
  d.line(s, bx, 2.3, bw, 0, { color: C.LIGHT, name: "bracket-line" });
  d.line(s, bx, 2.3, 0, 0.15, { color: C.LIGHT, name: "bracket-l" });
  d.line(s, bx + bw, 2.3, 0, 0.15, { color: C.LIGHT, name: "bracket-r" });
  d.anim(s, [
    [["pt-holds", "fade"], ["lbl-pt-holds", "fade"]],
    [["thr-construct", "fly", "bottom"], ["lbl-thr-construct", "fade"], ["thr-internal", "fly", "bottom"], ["lbl-thr-internal", "fade"],
     ["thr-conclusion", "fly", "bottom"], ["lbl-thr-conclusion", "fade"], ["bracket-line", "wipe", "left"], ["bracket-l", "fade"], ["bracket-r", "fade"], ["bracket-label", "fade"]],
    [["pt-experiment", "fade"], ["lbl-pt-experiment", "fade"]],
  ]);
  d.note(s, ["MORPH SOURCE: the five icons keep these names on every later slide.", "Say: three threats, in the order the paper's own Section VI lists them, minus external validity, which is the paper's strength."]);
}

// ---------- 3 · What holds ----------
{
  const s = d.slide();
  d.title(s, "The scale is real, the GFI effect is real, and the finding that no recommendation generalises everywhere is the paper's best contribution");
  d.tracker(s, 0);
  const cols = [
    { x: 0.9, icon: "icon-bug", num: "7 / 8", lbl: "datasets where bug fixes and fewer insertions raise newcomers' acceptance odds · Table XI", color: C.GREEN },
    { x: 4.95, icon: "icon-gfi-tag", num: "5.57×", lbl: "acceptance odds for a Good First Issue, newcomers in busy GitHub projects · Table VIII", color: C.GREEN },
    { x: 9.0, icon: "icon-stamp-accepted", num: "0 / 15", lbl: "recommendations supported in all eight datasets · Table XI", color: C.SLATE },
  ];
  const clicks = cols.map(c => {
    const i = d.img(s, c.icon, c.x + 1.15, 1.9, 1.1, 1.1);
    const n = d.big(s, c.num, c.x, 3.1, 3.4, 1.2, { color: c.color });
    const l = d.label(s, c.lbl, c.x, 4.4, 3.4, 1.0, { fontSize: 12, color: C.CHAR });
    return [[n, "zoom"], [i, "fade"], [l, "fade"]];
  });
  d.anim(s, clicks);
  d.note(s, ["Morph: pt-holds flies to the badge, the other four shrink into the strip.", "Say: credit first. These three numbers survive everything that follows."]);
}

// ---------- 4 · Construct validity ----------
{
  const s = d.slide();
  d.title(s, "The title and abstract promise higher odds of becoming a long-term contributor, but the only outcome variable in the paper is whether one patch was accepted");
  d.tracker(s, 1);
  const q = d.textBox(s, [{ text: "“abandon at non-newcomer status to increase their odds of becoming long-term contributors”", options: { italic: true } }],
    0.7, 2.0, 5.6, 1.7, { shape: d.shapes.WEDGE_RECTANGLE_CALLOUT, fontSize: 16, align: "left", margin: 0.2, name: "quote-abstract" });
  const qs = d.label(s, "Abstract, final sentence", 0.9, 3.95, 3.0, 0.3, { align: "left", fontSize: 11, italic: true });
  const sap = d.img(s, "icon-sapling", 0.9, 4.5, 1.0, 1.0);
  const sapl = d.label(s, "long-term contributor", 2.0, 4.8, 2.6, 0.4, { align: "left", fontSize: 13, color: C.CHAR });
  const ret = d.textBox(s, "retention · tenure · continued contribution        ?", 8.0, 2.0, 4.6, 1.1,
    { fill: C.WHITE, line: C.GREY, lineW: 1.5, dash: "dash", color: C.GREY, name: "box-retention" });
  const retl = d.label(s, "not measured anywhere in the paper", 8.0, 3.15, 4.6, 0.3, { fontSize: 11, italic: true });
  const acc = d.box(s, 8.0, 3.95, 4.6, 1.5, { fill: C.WHITE, line: C.SLATE, lineW: 1.5, name: "box-accepted" });
  const accl = d.label(s, "is_accepted", 8.2, 4.05, 2.2, 0.4, { align: "left", fontSize: 16, bold: true, color: C.CHAR });
  const accl2 = d.label(s, "one patch, one yes/no · Section IV-A-5", 8.2, 4.45, 2.4, 0.6, { align: "left", fontSize: 11 });
  const p1 = d.img(s, "icon-patch", 10.75, 4.1, 0.8, 0.95);
  const p2 = d.img(s, "icon-stamp-accepted", 11.6, 4.1, 0.85, 0.95);
  const arr = d.arrow(s, "right", 6.55, 2.3, 1.25, 0.55, { color: C.RED, name: "arrow-promise" });
  d.anim(s, [
    [[q, "fade"], [qs, "fade"], [sap, "fade"], [sapl, "fade"]],
    [[acc, "wipe", "bottom"], [accl, "fade"], [accl2, "fade"], [p1, "fade"], [p2, "fade"]],
    [[ret, "fade"], [retl, "fade"]],
    [[arr, "wipe", "left"]],
  ]);
  d.note(s, ["Say: the newcomer definition (IV-A-4) ends at the first accepted patch; after that everyone is one control group and the outcome is still acceptance of a single patch.",
             "Expected rebuttal: 'acceptance of later patches is a reasonable proxy.' Answer: then test the proxy; the data allow it (slide 8)."]);
}

// ---------- 5 · Internal validity (selection) ----------
{
  const s = d.slide();
  d.title(s, "The sign flips behind “abandon these strategies” are explained by who non-newcomers are, since the models control for neither tenure nor affiliation nor author");
  d.tracker(s, 2);
  const rows = [
    [d.hdr(""), d.hdr("M · NC"), d.hdr("M · CT"), d.hdr("H · NC"), d.hdr("H · CT")],
    [d.hdr("R6 low complexity"), d.ok(), d.bad(), d.ok(), d.bad()],
    [d.hdr("R7 documentation"), d.ok(), d.bad(), d.ok(), d.bad()],
    [d.hdr("R9 fewer deletions"), d.ok(), d.bad(), d.ok(), d.bad()],
  ];
  const t = d.table(s, rows, 0.6, 2.0, 4.6, { colW: [1.4, 0.8, 0.8, 0.8, 0.8], name: "table-xi-flips" });
  const tl = d.label(s, "Table XI · M/H = GitHub(M)/GitHub(H) · NC newcomers, CT non-newcomers", 0.6, 3.8, 4.6, 0.5, { fontSize: 11, italic: true, align: "left" });
  const j1 = d.img(s, "jar-newcomers", 5.7, 2.7, 1.7, 2.5);
  const j2 = d.img(s, "jar-nonnewcomers", 7.7, 2.7, 1.7, 2.5);
  const c1 = d.img(s, "char-newcomer", 6.0, 1.75, 1.1, 1.1);
  const c2 = d.img(s, "char-maintainer", 7.55, 1.75, 1.1, 1.1);
  const c3 = d.img(s, "char-employee", 8.5, 1.75, 1.0, 1.1);
  const l1 = d.label(s, "newcomers", 5.7, 5.3, 1.7, 0.3, { fontSize: 12, color: C.CHAR });
  const l2 = d.label(s, "non-newcomers", 7.7, 5.3, 1.7, 0.3, { fontSize: 12, color: C.CHAR });
  const miss = ["tenure", "affiliation", "author"].map((w, i) =>
    d.textBox(s, [{ text: w + "   ", options: { color: C.GREY } }, { text: "✗", options: { color: C.RED, bold: true } }],
      10.1, 2.3 + i * 0.85, 2.5, 0.65, { fill: C.PALE, line: C.GREY, fontSize: 15, name: "missing-" + w }));
  const missl = d.label(s, "not in any model · Section IV-A-5", 10.1, 4.9, 2.5, 0.5, { fontSize: 11, italic: true });
  d.anim(s, [
    [[t, "fade"], [tl, "fade"]],
    [[j1, "fade"], [j2, "fade"], [l1, "fade"], [l2, "fade"]],
    [[c1, "fly", "bottom"], [c2, "fly", "bottom"], [c3, "fly", "bottom"]],
    [[miss[0], "fade"], [miss[1], "fade"], [miss[2], "fade"], [missl, "fade"]],
    [[miss[0], "pulse"], [miss[1], "pulse"], [miss[2], "pulse"]],
  ]);
  d.note(s, ["Say: in Android, oVirt and Wikimedia the sponsor's employees are non-newcomers whose complex patches are accepted because they are trusted. Nothing separates trust from task type.",
             "Expected rebuttal: 'Section VI acknowledges non-newcomer diversity.' Answer: acknowledging a confound is not controlling for it."]);
}

// ---------- 6 · Internal validity (post-submission metrics) ----------
{
  const s = d.slide();
  d.title(s, "Review iterations is the strongest predictor in three of the five Gerrit models and is measured after submission, so the best-explaining variable is an outcome of review rather than a newcomer choice");
  d.tracker(s, 2);
  const nodes = [
    { x: 0.8, icon: "icon-patch", t: "submit" },
    { x: 4.0, icon: "icon-review-loop", t: "review rounds · patchsets accumulate" },
    { x: 7.2, icon: "icon-stamp-accepted", t: "accepted or rejected" },
  ];
  const nodeNames = [];
  nodes.forEach((n, i) => {
    const b = d.box(s, n.x, 1.95, 2.3, 1.15, { fill: C.LIGHT, name: "node-" + i });
    const ic = d.img(s, n.icon, n.x + 0.15, 2.05, 0.95, 0.95, { name: "node-icon-" + i });
    const lb = d.label(s, n.t, n.x + 1.15, 2.05, 1.1, 0.95, { fontSize: 11, color: C.CHAR, align: "left", valign: "middle", name: "node-label-" + i });
    const group = [[b, "wipe", "left"], [ic, "fade"], [lb, "fade"]];
    if (i === 2) group.push([d.label(s, "✗", n.x + 0.98, 2.62, 0.4, 0.4, { fontSize: 24, bold: true, color: C.RED, name: "node-reject" }), "fade"]);
    if (i < 2) group.push([d.arrow(s, "right", n.x + 2.4, 2.35, 0.7, 0.35, { name: "tl-arrow-" + i }), "wipe", "left"]);
    nodeNames.push(group);
  });
  const rev = d.arrow(s, "left", 4.3, 3.2, 4.1, 0.4, { color: C.RED, name: "arrow-reverse" });
  const revl = d.label(s, "the outcome shapes the “predictor”: an abandoned patch has one patchset, an engaged one has many", 4.3, 3.65, 5.2, 0.5, { fontSize: 11, color: C.RED, align: "left", italic: true });
  const ch = d.barChart(s, ["Android", "LibreOffice", "oVirt", "Typo3", "Wikimedia"], [3.09, 11.19, 14.19, 8.83, 0.61], 0.6, 4.1, 7.6, 2.3,
    { max: 16, title: "Explained deviance EP(%) of iterations, newcomer models · Table VII", name: "chart-iterations" });
  const stat = d.big(s, "14.2%", 8.6, 4.2, 3.6, 1.1, { color: C.RED, size: 60 });
  const statl = d.label(s, "of oVirt's explained deviance comes from iterations; next-best task-selection variable is bug fix at 4.7%", 8.6, 5.35, 3.6, 0.9, { fontSize: 12, color: C.CHAR });
  d.anim(s, [...nodeNames, [[rev, "wipe", "right"], [revl, "fade"]], [[ch, "wipe", "bottom"]], [[stat, "zoom"], [statl, "fade"]]]);
  d.note(s, ["Say: iterations is the top predictor in LibreOffice, oVirt and Typo3 (Android: bug fix; Wikimedia: promptness, also post-submission). 'Be patient' is advice derived from a variable the newcomer does not control.",
             "Cut this slide if short on time; it weakens Key Takeaway 4, not the headline."]);
}

// ---------- 7 · Conclusion validity ----------
{
  const s = d.slide();
  d.title(s, "With 262,013 newcomers in the busiest GitHub stratum, an odds ratio of 0.999 is significant at p < 0.001, explains under 0.2% of deviance, and is still reported as a negative association");
  d.tracker(s, 3);
  const n1 = d.big(s, "262,013", 0.6, 1.95, 4.1, 1.2, { size: 66 });
  const n1l = d.label(s, "newcomers, GitHub(H) · Table VI", 0.6, 3.2, 4.1, 0.4, { fontSize: 12, color: C.CHAR });
  const n2 = d.big(s, "0.999***", 4.7, 1.95, 3.9, 1.2, { color: C.RED, size: 66 });
  const n2l = d.label(s, "odds ratio for title length, newcomers · Table VIII", 4.7, 3.2, 3.9, 0.4, { fontSize: 12, color: C.CHAR });
  const ch = d.barChart(s, ["title len.", "desc. len.", "title read.", "desc. read.", "log(insert)", "doc file"], [0.01, 0.01, 0.03, 0.02, 2.92, 1.82], 8.7, 1.75, 4.2, 2.3,
    { colors: [C.GREY, C.GREY, C.GREY, C.GREY, C.SLATE, C.SLATE], format: "0.00", labelSize: 9, max: 3.5, title: "EP(%), GitHub(H) newcomers · Table VIII", name: "chart-ep" });
  const t = d.table(s, [
    [d.hdr("R10 · newcomers"), d.hdr("Android"), d.hdr("LibreOffice"), d.hdr("oVirt"), d.hdr("Typo3"), d.hdr("Wikimedia"), d.hdr("GitHub(L)"), d.hdr("GitHub(M)"), d.hdr("GitHub(H)")],
    [d.hdr("title length"), d.bad(), d.ns(), d.ns(), d.ns(), d.ns(), d.bad(), d.bad(), d.bad()],
  ], 0.6, 4.45, 12.1, { colW: [1.7, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3], name: "table-xi-r10" });
  const tl = d.label(s, "Table XI, row R10 · every ✗ is an odds ratio of 0.999 · ○ = not significant", 0.6, 5.4, 12.1, 0.3, { fontSize: 11, italic: true, align: "left" });
  const strike = d.line(s, 2.3, 5.07, 10.4, 0, { color: C.GREY, name: "strike-r10" });
  d.anim(s, [[[n1, "zoom"], [n1l, "fade"]], [[n2, "zoom"], [n2l, "fade"]], [[ch, "wipe", "bottom"]], [[t, "fade"], [tl, "fade"]], [[strike, "wipe", "left"]]]);
  d.note(s, ["Say: the paper's own EP column shows these are null effects; the abstract still counts them as 'four significant negative associations'.",
             "Expected rebuttal: 'EP is reported.' Answer: reported, then not applied in the abstract or Table XI."]);
}

// ---------- 8 · The experiment ----------
{
  const s = d.slide();
  d.title(s, "Following the same contributors from their second to their tenth patch would separate what stage changes from who the non-newcomers are");
  d.tracker(s, 4);
  const nc = d.img(s, "char-newcomer", 0.25, 2.55, 1.45, 2.1);
  const px0 = 1.95, pstep = 0.95, py = 3.1, psz = 0.8;
  const tiles = [], labels = [];
  let stamp = null, first = null;
  for (let i = 0; i < 10; i++) {
    const complex = i % 2 === 1, x = px0 + i * pstep;
    tiles.push(d.box(s, x, py, psz, psz, { fill: i === 0 ? C.MINT : (complex ? C.SLATE : C.LIGHT), name: "tile-" + (i + 1) }));
    tiles.push(d.img(s, "icon-patch", x + 0.12, py + 0.08, psz - 0.24, psz - 0.16, { name: "patch-" + (i + 1) }));
    if (i === 0) stamp = d.img(s, "icon-stamp-accepted", x + 0.42, py + 0.42, 0.42, 0.42, { name: "stamp-first" });
    if (i > 0) labels.push(d.label(s, complex ? "complex" : "simple", x - 0.1, py + psz + 0.08, psz + 0.2, 0.3, { fontSize: 10, color: complex ? C.SLATE : C.GREY }));
  }
  const ln = d.line(s, px0 + pstep, 2.8, 9 * pstep - (pstep - psz), 0, { color: C.SAGE, width: 3, name: "line-same-person" });
  const lnl = d.label(s, "same person, patches 2–10", px0 + pstep, 2.45, 4.0, 0.3, { fontSize: 12, color: C.SAGE, align: "left", bold: true });
  first = d.label(s, "first patch\naccepted", px0 - 0.15, py + psz + 0.08, psz + 0.3, 0.5, { fontSize: 9, color: C.GREEN });
  const sap = d.img(s, "icon-sapling", 11.75, 2.3, 0.95, 0.95);
  const q = d.label(s, "?", 12.6, 2.2, 0.4, 0.4, { fontSize: 22, bold: true, color: C.SLATE, name: "sapling-q" });
  const sapl = d.label(s, "still contributing\nat 12 months?", 11.45, 3.3, 1.6, 0.6, { fontSize: 10, color: C.CHAR });
  const mt = d.img(s, "char-maintainer", 11.7, 4.0, 1.2, 1.6);
  const feas = d.label(s, "Feasible with the paper's own 1.4M Gerrit reviews and 6M GitHub pull requests: compare acceptance of simple vs complex patches within the same early-stage contributor, then test whether the choice predicts activity a year later.", 2.1, 4.95, 9.4, 0.9, { fontSize: 13, color: C.CHAR, align: "left" });
  d.anim(s, [
    [[nc, "fade"], [tiles[0], "fade"], [tiles[1], "fade"], [stamp, "zoom"], [first, "fade"]],
    [[ln, "wipe", "left"], [lnl, "fade"], ...tiles.slice(2).map(n => [n, "wipe", "left"]), ...labels.map(n => [n, "fade"])],
    [[sap, "fade"], [q, "zoom"], [sapl, "fade"], [mt, "fade"]],
    [[feas, "fade"]],
  ]);
  d.note(s, ["Say: a within-person design removes the composition problem by construction, and a 12-month activity outcome measures what the title promises. The authors have the data; this is a revision, not a new study."]);
}

// ---------- 9 · Conclusion ----------
{
  const s = d.slide();
  d.title(s, "Three threats leave the patch-acceptance findings standing and the long-term-contributor claim unsupported, so the paper should be reframed as a study of patch acceptance before it is accepted");
  d.agendaRow(s, { marks: true });
  const orig = d.label(s, "From First Patch to Long-Term Contributor: Evaluating Onboarding Recommendations for OSS Newcomers", 1.1, 4.95, 9.2, 0.4, { fontSize: 13, strike: true, align: "left", name: "title-original" });
  const re = d.textBox(s, "Which patches get accepted: evaluating onboarding recommendations across OSS contexts", 1.1, 5.45, 9.2, 0.85,
    { radius: 0.1, fontSize: 17, bold: true, align: "left", margin: 0.2, name: "title-reframed" });
  const verdict = d.label(s, "reject as written · accept reframed", 1.1, 6.4, 9.2, 0.35, { fontSize: 12, italic: true, align: "left", color: C.SLATE });
  const hero = d.img(s, "hero-door", 10.9, 4.9, 2.1, 1.9);
  d.anim(s, [
    [["mark-thr-construct", "pulse"], ["mark-thr-internal", "pulse"], ["mark-thr-conclusion", "pulse"]],
    [[orig, "fade"]],
    [[re, "wipe", "left"], [verdict, "fade"]],
    [[hero, "fade"]],
  ]);
  d.note(s, ["Morph closes the loop: all five icons travel back to the agenda row carrying their marks.",
             "Close: this paper tells us which patches get accepted, not which newcomers become long-term contributors."]);
}

d.finalize({ morph: [3, 4, 5, 6, 7, 8, 9], fade: [2] });
