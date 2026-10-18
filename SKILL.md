---
name: paper-presentation
description: Turn an academic paper (PDF or arXiv link) into a visual-first slide presentation plan for a course or reading-group talk — paper summary (main idea, methodology, findings, implications), a ≤20-slide outline with exactly one sentence per slide and no bullet points, a per-slide visual/diagram plan, an icon checklist, animation design, and image-generation prompts in the style of the user's reference deck. Use this whenever the user asks to present a paper, make slides from a paper, prepare a paper talk, review/summarize a paper for CS846/CS886 or any seminar, or asks for figure/icon prompts for a paper deck — even if they only say "read this paper and brainstorm slides".
---

# Paper → presentation plan

The user (a grad student presenting papers in seminar courses) wants slides that are almost entirely visual: one sentence per slide, no bullets, a diagram or icon composition on every slide, step-by-step animations, and icons they generate themselves and assemble in PowerPoint. The deliverable is a **plan they build from**, not a finished .pptx, unless they explicitly ask for the file.

Work in stages and stop for approval between them — the user wants to see the outline before any visual work is spent on it.

## Stage 1 — Read and summarize

Read the whole PDF (use `pages` ranges; tables and figure captions matter most). Then give, in chat:

1. **Main idea** — the one-paragraph thesis: what problem, what insight, why prior work fails.
2. **Methodology** — numbered pipeline/steps with the key parameters (e.g. M×P×N loops, k, thresholds), datasets, models, baselines.
3. **Findings** — every headline number with its denominator (reproduced/fixed/accepted, ablation deltas, baseline comparison, survey stats). Pull exact figures from tables; these become stat callouts and charts later.
4. **Implications** — what the result changes for practice and research, plus limitations/threats the paper admits.

Keep it tight; numbers in a table beat numbers in prose.

## Stage 2 — Outline (show this first, then wait)

Produce a table: `# | Sentence | Visual`. Rules that matter:

- **≤20 slides**, one complete sentence per slide, no title-only fragments except slide 1. The sentence *is* the slide text; the visual carries everything else.
- Arc: hook/definition → scale/why it matters → prior work fails → core diagnosis → running example → method steps (one slide each) → results (one chart per slide) → comparison → human/qualitative → takeaway that echoes an early slide.
- Mark every slide that needs a figure with 🖼 and say in three words what kind (funnel, Venn, call chain, Goldilocks spectrum…).
- Prefer visuals the user can **construct in PowerPoint from icons** (graphs from circles+arrows, funnels, pipelines, nested rings) over one-off generated images. Reserve generated images for hero illustrations (title, closing) and characters.
- Reuse a **tracker motif**: a strip repeated across the method slides with the current stage highlighted, and checkmarks accumulating on the results slide. The user's template does this with "Threats to Validity".
- **Research questions get their own slide and their own icons.** Place an RQ slide right before the results section: one icon per RQ in a row, short label beneath each. Every results slide then answers exactly one RQ (label it "RQn –" in the outline) and carries that RQ's icon as a top-right badge, brought in with the **Morph transition** (see Stage 3). The closing slide morphs all RQ icons back into a row with checkmarks. If the paper has no explicit RQs, derive 3–5 from the evaluation subsections and say so.

End with: "Reply with changes (or 'go') and I'll write the per-slide visual, icon, and animation plan."

## Stage 3 — Per-slide plan + icon checklist

If the user points at a reference deck (.pptx), inspect it first: unzip media, view a handful of images, dump slide text. Record the palette, illustration style (e.g. flat cartoon, thick outlines), recurring motifs, and layout (title position, slide number). Match it. See `references/visual-style.md` for the user's current house style; update that file if a new template shows a different one.

For each slide write (use `references/slide-plan-template.md` as the format):

- **Sentence** (unchanged from approved outline).
- **Main idea** — what the audience must take from this slide in one line.
- **Visual** — exact composition: what sits left/centre/right, which numbers appear as big stat callouts, which charts should be native PowerPoint charts (bar, donut) versus shapes (Venn, call graph, funnel).
- **Icons** — list by slug from the shared icon set.
- **Animation** — click-by-click sequence using PowerPoint effects by name (Fade, Wipe from bottom, Fly In, Grow & Turn, Wheel, Move Path, Pulse, Fill Color, Morph transition). Animation should *reveal the mechanism* (nodes selected one level at a time, unexecuted nodes fading out, red flask turning green), not decorate.

**RQ icons and Morph.** Give each RQ a distinct, meaning-bearing icon slug (`rq-target` for effectiveness, `rq-puzzle` for ablation, `rq-podium` for baseline comparison, `rq-swap` for model sensitivity, `rq-people` for user studies — invent others as needed). In the plan, state that the RQ slide is the Morph source: the user duplicates it for each results slide, drags the answering RQ's icon to the badge position, deletes the rest, and sets Transition → Morph. Morph only animates motion when the object is the same picture with the same name across slides, so say that explicitly in a "Morph setup notes" section. When consecutive slides answer the same RQ, the badge stays put; when the RQ changes, describe the swap (old badge fades back, new one rises).

Then an **asset strategy** section with a small reusable set — aim for **15–20 generated images**, not one per slide. Generate only what PowerPoint shapes cannot do: characters, a hero scene, one robot/mascot, and a handful of symbolic icons (flask, compass, magnifier, puzzle…). Everything geometric is a native shape (circles for graph nodes, arrows, lightning, trapezoid funnels, rings, stars, tables, octagons, pills, ✓/✗) so it is recolorable and animatable per element. Derive variants by overlay instead of new images (blindfold rectangle on the robot, star shapes for dizzy, thought-bubble shape, tool icon placed beside the hand, one-tone recolor for silhouettes, duplicate-and-offset for stacks, scale-down for snippets). Present it as a table: slug, what, slides reused on — the reuse column is the check that the set is actually small and shared.

Save the whole plan as `<PaperShortName>_slide_plan.md` in the working directory, **using exactly the eight numbered sections of `references/slide-plan-template.md`** in that order with those headings (Paper summary · Outline · Asset strategy · Recurring motifs · Slides · Morph setup notes · Native charts · Image-generation prompts). The fixed structure is what lets the user compare plans across papers and reuse icon sets; do not merge, rename, or drop sections — write "none" under a section that does not apply. Stage 1 fills section 1, Stage 2 fills section 2, Stage 3 fills 3–7, Stage 4 fills 8. Summarize in chat.

## Stage 4 — Image prompts (append to the plan)

Append an "Image-generation prompts" section to the plan file. Define two shared style suffixes once (one for icons, one for characters/hero scenes) carrying the style words and palette hex codes, then write one short subject line per icon and reference the suffix — this keeps 50+ prompts readable and consistent. Group prompts by family (RQ icons, characters, robot variants, tests, code, graph, process, categories, survey). Say "no text, no letters" since numbers and labels are added in PowerPoint. Add batch tips: same seed/style reference across the session, generate the base character/robot first and reuse it as a reference for variants, request transparent PNG. If an image-generation tool is available (e.g. a `paper-illustration` skill or codex image tool), offer to run it.

## Stage 5 — Build the deck (only if asked)

If the user wants the .pptx, use the pptx skill: duplicate layouts from their template, one text box for the sentence, insert icon PNGs, native charts for numeric results, and set animations via XML only if they ask (otherwise note "add animations per plan"). Run the pptx QA (validate + render) before handing over.

## Things learned from past sessions

- Show the outline **before** icon/visual work; the user wants to edit it first.
- The user builds diagrams themselves from icons, so prefer icon *sets* over bespoke figure images.
- No bullet points anywhere on slides; the chat deliverable can use tables.
- Big numbers go in stat callouts (60–72 pt) with a small label, one per concept.
- Always extract the paper's own figure numbers (Venn overlaps, ablation counts) so charts are faithful.
