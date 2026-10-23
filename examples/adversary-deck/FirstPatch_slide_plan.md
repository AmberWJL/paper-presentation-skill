# FirstPatch (adversary) – 9-slide plan

**Paper:** From First Patch to Long-Term Contributor: Evaluating Onboarding Recommendations for OSS Newcomers, Turzo, Sultana, Bosu, IEEE TSE 51(4), 2025 (arXiv 2407.04159)
**Mode:** adversary
**Reference deck:** house style from "CS886 Paper 2.pptx" (references/visual-style.md)
**Palette:** slate blue 4A6FA5 · sage green 8FAF9A · light blue CFE3F0 · charcoal 2E3A46 · red E63946 · green 4CAF7A · grey 9AA5B1

**Role:** adversary, presented after the champions. No methodology or results exposition; every slide is a judgement backed by the paper's own number.

## 1. Paper summary
**Main idea:** Onboarding advice for OSS newcomers comes from interviews on a few projects and has never been tested at scale or against non-newcomers. The paper distils 15 task-related recommendations via an SLR, maps each to a patch metric, and fits logistic regressions on 1.4M Gerrit reviews and 6M GitHub PRs to see which correlate with first-patch acceptance and which flip for established contributors. It concludes that four recommendations help newcomers in most contexts, four are context-dependent, four are negative, and three should be abandoned after the first accepted patch "to increase the odds of becoming long-term contributors".

**Methodology:**
1. SLR 605 → 16 primary studies (Table I); 10 interview/survey, 5 MSR, 1 mixed (Table III).
2. 15 recommendations: 9 task selection, 4 task preparation, 2 task completion (Table IV).
3. One metric per recommendation (Table V): churn, GFI label, new feature, bug fix, file count, change entropy, doc-file ratio, insertions, deletions, title/description length, Flesch readability, promptness, iterations.
4. 5 Gerrit projects (Android, LibreOffice, oVirt, Typo3, Wikimedia) + 1,155 GitHub projects in three activity strata (Table VI).
5. Two inferential logistic regressions per dataset (newcomer / non-newcomer), Harrell procedure, variable clustering |ρ| = 0.7, Veall–Zimmerman pseudo-R², per-variable explained deviance EP(%).
6. Verdict rule: supported if OR significantly > 1; contradicted if significantly < 1.

**Findings:**
| Metric | Value | Denominator / context |
|---|---|---|
| Gerrit CRs / GitHub PRs | 1,438,042 / 5,996,077 | Table VI |
| Newcomers, GitHub(H) | 262,013 | Table VI |
| Recommendations supported in all 8 datasets | 0 of 15 | Table XI |
| Bug fix (R4), fewer insertions (R8) supported | 7 of 8 | newcomers, Table XI |
| GFI OR, newcomers | 5.57 (H), 2.02 (M), n.s. (L) | Table VIII |
| GFI OR, non-newcomers | 2.05 (H), 2.45 (M), 2.58 (L) | Table X |
| Title / description length OR | 0.999*** – 1.001*** | Tables VII, VIII, X |
| EP(%) title/desc metrics, GitHub(H) newcomers | 0.01 / 0.01 / 0.03 / 0.02 | Table VIII |
| EP(%) iterations, Gerrit newcomers | 3.09 / 11.19 / 14.19 / 8.83 / 0.61 | Android / LibreOffice / oVirt / Typo3 / Wikimedia, Table VII |
| Strongest predictor per Gerrit newcomer model | iterations ×3, bug fix (Android), promptness (Wikimedia) | Table VII EP |
| Pseudo-R², newcomer models | 0.054 – 0.388 | Tables VII–VIII |
| Newcomer-specific sign flips | R6, R7, R9 | Table XI |

**Implications:** Keep GFI labelling and steer newcomers to bug fixes and small insertions; stop polishing titles. Admitted threats (Section VI): SLR completeness, sample representativeness, metric mapping for complexity and proactivity, pooling all non-newcomer types. Not admitted: retention is never measured; no controls for tenure, affiliation, or author clustering; post-submission metrics are partly outcomes of review; significance with N in the hundreds of thousands is treated as support.

## 2. Outline
| # | Sentence | Visual type | RQ |
|---|---|---|---|
| 1 | The adversary's case: the claims outrun the evidence. | hero | – |
| 2 | I will grant what holds, raise three threats to validity, and name the experiment that would change my mind. | icon row (Morph source) | – |
| 3 | The scale is real, the GFI effect is real, and the finding that no recommendation generalises everywhere is the paper's best contribution. | stat callouts | holds |
| 4 | The title and abstract promise higher odds of becoming a long-term contributor, but the only outcome variable in the paper is whether one patch was accepted. | quote vs variable box | construct |
| 5 | The sign flips behind "abandon these strategies" are explained by who non-newcomers are, since the models control for neither tenure nor affiliation nor author. | flipping grid + population jars | internal |
| 6 | Review iterations is the strongest predictor in three of the five Gerrit models and is measured after submission, so the best-explaining variable is an outcome of review rather than a newcomer choice. | reversed timeline + bar chart | internal |
| 7 | With 262,013 newcomers in the busiest GitHub stratum, an odds ratio of 0.999 is significant at p < 0.001, explains under 0.2% of deviance, and is still reported as a negative association. | giant N vs tiny OR | conclusion |
| 8 | Following the same contributors from their second to their tenth patch would separate what stage changes from who the non-newcomers are. | within-person timeline | experiment |
| 9 | Three threats leave the patch-acceptance findings standing and the long-term-contributor claim unsupported, so the paper should be reframed as a study of patch acceptance before it is accepted. | icon row with marks (Morph close) | – |

## 3. Asset strategy (15 generated images + PowerPoint shapes)
| Slug | What | Reused on |
|---|---|---|
| hero-door | newcomer character standing at an open door, long corridor of doors receding behind | 1, 9 (scaled down, bottom-left) |
| char-newcomer | newcomer, hoodie, holding a patch document, hopeful | 4, 5, 8 |
| char-maintainer | maintainer, glasses, holding a rubber stamp | 5, 8 |
| char-employee | contributor with a company lanyard and badge | 5 |
| pt-holds | shield with a check mark | 2, 3, 9 (+ strip on 4–8) |
| thr-construct | balance scale | 2, 4, 9 (+ strip) |
| thr-internal | two glass jars of beads | 2, 5, 6, 9 (+ strip) |
| thr-conclusion | magnifying glass over a tiny dot | 2, 7, 9 (+ strip) |
| pt-experiment | laboratory flask | 2, 8, 9 (+ strip) |
| icon-patch | document with three diff lines | 4, 6, 8 (duplicated ×10 on 8) |
| icon-stamp-accepted | round green "accepted" stamp, no text | 3, 4, 6, 8 |
| icon-gfi-tag | price-tag style label | 3 |
| icon-bug | cartoon bug | 3 |
| icon-sapling | small sapling in soil (long-term growth) | 4, 9 |
| icon-review-loop | two circular arrows around a patch | 6 |

**Variants by overlay:** char-newcomer + icon-stamp-accepted overlaid bottom-right → "first patch accepted"; char-employee = char-maintainer base with a lanyard shape drawn in PowerPoint if the generated one does not match; icon-patch + red ✗ shape → rejected patch; icon-patch duplicated and offset ×3 → "patchsets"; thr-internal recoloured grey → inactive strip state; any point icon + green ✓ or red ✗ shape at its corner → strip verdict.
**Shapes used as icons:** rounded rectangles (variable boxes, dashed for "retention"), speech-bubble callout, block arrows, bent arrow (reversed causality), thin horizontal strip, bar chart (native), ✓/✗ (Wingdings or freeform), big-number text boxes, table cells (Table XI excerpt as a native table), jar-fill circles (coloured dots inside the jar PNGs).

## 4. Recurring motifs
**Tracker strip:** the five agenda icons shrunk to 48 px in a row across the bottom (y ≈ 92% of slide height), grey tint for not-yet-covered, full colour for the current one (which is also enlarged as the badge), and a ✓ (pt-holds) or ✗ (the three threats) stuck to covered ones. Appears on slides 3–8; on slide 9 the strip expands back into the full row.
**RQ icons with Morph:** the agenda (slide 2) is the Morph source. Badge mapping: 3 → pt-holds; 4 → thr-construct; 5, 6 → thr-internal (badge stays put between 5 and 6); 7 → thr-conclusion; 8 → pt-experiment; 9 → all five return to the row carrying ✓ ✗ ✗ ✗ →. The paper's RQ1–RQ3 are not used as badges because the champions already walked them; slide 9 mentions them only through the "patch-acceptance findings standing" wording.

## 5. Slides

### 1 · Title
Sentence: The adversary's case: the claims outrun the evidence.
Main idea: this is a critique, and the critique is about scope, not sloppiness.
Visual: hero-door centred, slightly right; sentence top-left 32 pt; small source tag bottom-left "Turzo, Sultana, Bosu · TSE 2025".
Animation: none (static title). Transition into slide 2: Fade.

### 2 · Agenda
Sentence: I will grant what holds, raise three threats to validity, and name the experiment that would change my mind.
Main idea: five stops, in order; the three middle ones are the attack.
Visual: five icons in a row at 140 px, evenly spaced across the centre: pt-holds, thr-construct, thr-internal, thr-conclusion, pt-experiment. A 14 pt label under each: "What holds", "Construct", "Internal", "Conclusion", "What would change my mind". Thin light-blue CFE3F0 bracket shape spanning the middle three with the label "threats to validity" above it.
Animation: click 1 pt-holds Fade in with label; click 2 the three threat icons Fly In from bottom one after another (0.2 s delay) and the bracket Wipe from left; click 3 pt-experiment Fade in. Name every icon now in the Selection Pane (see section 6).

### 3 · What holds
Sentence: The scale is real, the GFI effect is real, and the finding that no recommendation generalises everywhere is the paper's best contribution.
Main idea: credit before critique; these three numbers survive everything that follows.
Visual: three stat callouts across the centre at 64 pt with 12 pt labels: "7 / 8" (datasets where bug fixes and fewer insertions help newcomers, Table XI) with icon-bug above; "5.57×" (GFI acceptance odds, busy GitHub projects, Table VIII) with icon-gfi-tag above; "0 / 15" (recommendations supported everywhere, Table XI) with icon-stamp-accepted above crossed by a thin grey line. Badge: pt-holds top-right at 96 px. Strip at bottom with the other four grey.
Animation: Morph from slide 2 (pt-holds flies to badge, others shrink to strip). Click 1 first callout Grow & Turn; click 2 second; click 3 third; click 4 a green ✓ Fade in on the badge.

### 4 · Construct validity
Sentence: The title and abstract promise higher odds of becoming a long-term contributor, but the only outcome variable in the paper is whether one patch was accepted.
Main idea: the headline construct is never operationalised.
Visual: left half: speech-bubble callout containing the abstract fragment "abandon at non-newcomer status to increase their odds of becoming long-term contributors" with source tag "Abstract"; icon-sapling beside it labelled "long-term contributor". Right half: one solid rounded rectangle labelled "is_accepted" (Section IV-A-5) with icon-patch and icon-stamp-accepted inside; above it a dashed, empty rounded rectangle labelled "retention / tenure" with a grey question mark. A block arrow from the bubble to the dashed box, coloured red E63946. Badge thr-construct; strip shows pt-holds ✓.
Animation: Morph from slide 3 (thr-construct rises to badge, pt-holds drops to strip). Click 1 bubble + sapling Fade; click 2 is_accepted box Wipe from bottom; click 3 dashed box Fade with the question mark Pulse; click 4 red arrow Wipe from left; click 5 red ✗ Fade onto the badge.

### 5 · Internal validity (selection)
Sentence: The sign flips behind "abandon these strategies" are explained by who non-newcomers are, since the models control for neither tenure nor affiliation nor author.
Main idea: a composition difference masquerading as a stage effect.
Visual: left third: native 3×3 table excerpt of Table XI for R6, R7, R9 with NC/CT columns for GitHub(M) and GitHub(H), ✓ in green for NC and ✗ in red for CT. Centre: thr-internal enlarged as two jars; left jar labelled "newcomers" filled with light-blue dots and one char-newcomer peeking over the rim; right jar labelled "non-newcomers" filled with mixed dots and char-maintainer plus char-employee peeking over. Right third: three small grey rounded rectangles stacked, labelled "tenure", "affiliation", "author", each with a red ✗ (not in the model, Section IV-A-5). Badge thr-internal; strip shows pt-holds ✓, thr-construct ✗.
Animation: Morph from slide 4. Click 1 table Fade, then the three CT cells Fill Color to red one by one; click 2 jars Fade with dots Appear in a quick sequence; click 3 characters Fly In from bottom over the right jar; click 4 the three missing-covariate boxes Fade with ✗ Pulse; no ✗ on the badge yet (point continues on slide 6).

### 6 · Internal validity (post-submission metrics)
Sentence: Review iterations is the strongest predictor in three of the five Gerrit models and is measured after submission, so the best-explaining variable is an outcome of review rather than a newcomer choice.
Main idea: reverse causality in the two "task completion" metrics.
Visual: top: horizontal timeline of three nodes with icon-patch ("submit"), icon-review-loop ("review"), and icon-patch ×3 offset ("patchsets = iterations"); a bent block arrow in red from "review" back to "patchsets" labelled "counted as a newcomer strategy". Bottom: native bar chart of iterations EP(%) across the five Gerrit newcomer models (3.09, 11.19, 14.19, 8.83, 0.61) with "14.2%" as a 60 pt callout beside the oVirt bar and a 12 pt note "Table VII". Badge thr-internal stays in place; strip unchanged.
Animation: Morph from slide 5 (badge does not move; the jars shrink into the badge). Click 1 timeline nodes Wipe from left in sequence; click 2 red bent arrow Wipe; click 3 bar chart Wipe from bottom, bars one at a time; click 4 callout Grow & Turn; click 5 red ✗ Fade onto the badge.

### 7 · Conclusion validity
Sentence: With 262,013 newcomers in the busiest GitHub stratum, an odds ratio of 0.999 is significant at p < 0.001, explains under 0.2% of deviance, and is still reported as a negative association.
Main idea: sample size turned "no effect" into a finding.
Visual: left: "262,013" at 72 pt with label "newcomers, GitHub(H), Table VI". Centre: "0.999***" at 72 pt in red with label "odds ratio, title length, Table VIII". Right: tiny native bar chart of EP(%) for GitHub(H) newcomers: title length 0.01, description length 0.01, title readability 0.03, description readability 0.02, against log(insert) 2.92 and doc file 1.82 for scale. Below: a short strip reproducing the Table XI row R10 with its red ✗ cells, and a thin grey line through it. Badge thr-conclusion; strip shows ✓ ✗ ✗.
Animation: Morph from slide 6. Click 1 N callout Grow & Turn; click 2 OR callout Grow & Turn; click 3 bar chart Wipe from bottom (the four tiny bars barely appear, which is the point); click 4 Table XI row Fade then grey line Wipe; click 5 red ✗ onto the badge.

### 8 · The experiment that would change my mind
Sentence: Following the same contributors from their second to their tenth patch would separate what stage changes from who the non-newcomers are.
Main idea: the fix is a within-person design, and it is feasible with the paper's own dataset.
Visual: one char-newcomer at the left; a horizontal row of ten icon-patch across the slide, the first stamped with icon-stamp-accepted; above patches 2–10 a thin sage-green 8FAF9A line labelled "same person"; below, two alternating markers "simple" / "complex" (light-blue vs slate-blue fills on the patches); at the far right icon-sapling with a question mark, labelled "still contributing at 12 months?". char-maintainer small at the right end. Badge pt-experiment; strip ✓ ✗ ✗ ✗.
Animation: Morph from slide 7. Click 1 newcomer + first patch + stamp Fade; click 2 patches 2–10 Wipe from left in sequence along the line; click 3 fills alternate (Fill Color) to show the complexity contrast; click 4 sapling + question mark Fade and Pulse; click 5 a green → arrow Fade onto the badge (not a verdict mark).

### 9 · Conclusion
Sentence: Three threats leave the patch-acceptance findings standing and the long-term-contributor claim unsupported, so the paper should be reframed as a study of patch acceptance before it is accepted.
Main idea: reject as written, accept reframed; the summary is the agenda row with verdicts.
Visual: the five icons back in the agenda row at 140 px, each carrying its mark: pt-holds ✓ green, thr-construct ✗, thr-internal ✗, thr-conclusion ✗, pt-experiment →. Beneath the row, a single rounded rectangle in light blue showing the reframed title "Which patches get accepted: evaluating onboarding recommendations across OSS contexts" with the original title above it struck through in grey. hero-door small at bottom-left as the echo of slide 1.
Animation: Morph from slide 8 (all icons travel back to the row; the strip disappears). Click 1 the three ✗ Pulse together; click 2 the original title Fade in then its strike-through line Wipe; click 3 the reframed title Wipe from left; click 4 hero-door Fade.

## 6. Morph setup notes
Insert each of the five point icons once, on slide 2, and name them in the Selection Pane: `pt-holds`, `thr-construct`, `thr-internal`, `thr-conclusion`, `pt-experiment`. Do the same for their labels (`lbl-holds` …) so the labels can shrink with the icons. Build slide 3 by duplicating slide 2, dragging `pt-holds` to the badge position (top-right, 96 px, right edge 0.4 in from the slide edge, top aligned with the sentence baseline) and shrinking the other four to 48 px along the strip at the bottom; set Transition → Morph, duration 0.75 s. Build each later slide by duplicating the previous one, moving the next icon from the strip to the badge and the previous badge back to the strip, then adding its ✓/✗ as a separate small shape named `mark-<slug>` so it also morphs on slide 9. Never re-insert an icon from disk; copy within the deck or Morph will fade instead of move. Slides 5 → 6 keep `thr-internal` in place so Morph only animates the content; slide 9 is a duplicate of slide 8 with all five dragged back to the slide-2 positions. Slides 1 → 2 use Fade, not Morph.

## 7. Native charts
6: clustered bar, iterations EP(%) newcomer models, Android 3.09, LibreOffice 11.19, oVirt 14.19, Typo3 8.83, Wikimedia 0.61 (Table VII); slate blue 4A6FA5 bars, oVirt bar red E63946.
7: clustered bar, EP(%) GitHub(H) newcomers, title length 0.01, description length 0.01, title readability 0.03, description readability 0.02, log(insert) 2.92, doc file 1.82 (Table VIII); the four tiny bars grey 9AA5B1, the two reference bars slate blue.
5: native table, Table XI excerpt rows R6, R7, R9 × GitHub(M) NC/CT, GitHub(H) NC/CT; ✓ green 4CAF7A, ✗ red E63946.
7: native table, Table XI row R10 across all eight datasets.

## 8. Image-generation prompts (15)
**Icon suffix:** flat cartoon icon, thick charcoal #2E3A46 outlines, simple fills in slate blue #4A6FA5, sage green #8FAF9A, light blue #CFE3F0, white background removed, transparent PNG, square, centred, no text, no letters, no numbers.
**Character suffix:** flat cartoon character, thick charcoal #2E3A46 outlines, friendly proportions, palette slate blue #4A6FA5, sage green #8FAF9A, light blue #CFE3F0, muted skin tones, transparent PNG, full body, no text, no letters.

Point icons (agenda / badges)
1. **pt-holds** — a shield with a bold check mark cut into its face. + icon suffix
2. **thr-construct** — a classic two-pan balance scale, pans level. + icon suffix
3. **thr-internal** — two identical glass jars side by side, left jar filled with same-colour beads, right jar filled with mixed-colour beads. + icon suffix
4. **thr-conclusion** — a magnifying glass held over a single tiny dot. + icon suffix
5. **pt-experiment** — an Erlenmeyer flask half full of liquid, three bubbles rising. + icon suffix

Characters and hero
6. **hero-door** — a young person in a hoodie standing in an open doorway, looking down a long corridor of identical doors receding into the distance, soft light from the far end. + character suffix, 16:9 scene
7. **char-newcomer** — a young person in a hoodie holding a single sheet of paper with a few lines on it, hopeful expression. + character suffix
8. **char-maintainer** — an older person with glasses holding a rubber stamp, neutral expression. + character suffix
9. **char-employee** — a person in a collared shirt wearing a lanyard with a blank badge. + character suffix

Symbolic icons
10. **icon-patch** — a single sheet of paper with three short horizontal lines, the middle one in sage green and the bottom one in red. + icon suffix
11. **icon-stamp-accepted** — a round rubber-stamp impression in green with a check mark in the centre. + icon suffix
12. **icon-gfi-tag** — a price-tag style label with a hole and a short string, light blue fill. + icon suffix
13. **icon-bug** — a cute round beetle, top view, six legs, slate blue shell. + icon suffix
14. **icon-sapling** — a small sapling with two leaves growing from a mound of soil. + icon suffix
15. **icon-review-loop** — two curved arrows forming a circle around a small sheet of paper. + icon suffix

**Batch tips:** generate char-newcomer first and use it as the style reference for char-maintainer, char-employee, and hero-door; generate pt-holds first and reference it for the other icons so outline weight matches; keep the same seed or style reference across the session; request transparent PNG at 1024×1024 for icons and 1792×1024 for hero-door; after generation, recolour nothing in the images and do all state changes (grey tint, ✓/✗) with PowerPoint overlays.

## 9. Build log
Deck: FirstPatch_adversary.final.pptx (build with build.js, then scripts/postprocess.py) · Plan JSON: FirstPatch_adversary.plan.json
Renderer used for QA: keynote (charts not shown; verified from XML) and powerpoint (first pass)
QA fixes: table headers shortened to avoid mid-word wraps; chart labels given decimals; strike line limited to data cells; slide-8 label and sapling repositioned twice; slide-6 red ✗ moved off the stamp ring
Assets still placeholders: pt-holds, char-employee, hero-door, icon-stamp-accepted, icon-gfi-tag, icon-bug, icon-sapling, icon-review-loop, jar-newcomers, jar-nonnewcomers (the asset set was replaced by seven icons in the house style; thr-* and char-maintainer resolve through manifest aliases)
