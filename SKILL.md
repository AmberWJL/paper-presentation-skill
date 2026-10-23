---
name: paper-presentation
description: Turn an academic paper (PDF or arXiv link) into a visual-first seminar talk and build the .pptx — one sentence per slide, no bullets, icon rows instead of lists, Morph transitions between points, click-by-click entrance animations written into the file, native charts/tables, speaker notes. Three modes - champion (make the case for the paper), adversary (argue the reject case after the champions), presenter (the champion deck plus a short, fair critique; the default) - each with its own slide arc and analysis prompt. Use this whenever the user asks to present a paper, make slides from a paper, prepare a paper talk or reading-group/seminar deck for any course, says they are the champion/adversary/critic/reviewer for a paper, or wants figure/icon prompts for a paper deck — even if they only say "read this paper and brainstorm slides" or "I'm presenting this next week". Not for reviewing a paper without slides (use paper-review) or for generic decks.
---

# Paper → slide plan → built deck

The user is a grad student presenting papers in seminar courses. They want decks that are almost entirely
visual: one sentence per slide, no bullets anywhere, a diagram or icon composition on every slide, icons
in a row where a list would be, a tracker that accumulates marks, Morph between points, and step-by-step
animations. The deliverables are a **plan** (fixed nine-section Markdown) and a **built .pptx** that
matches it, with placeholders where icons are not yet available.

Work in stages and stop for approval at two gates: after the outline, and after the per-slide plan.

## Setup (once per machine)

```bash
cd <this skill>/scripts && npm install          # pptxgenjs + jszip for deck_lib.js
pip install pillow numpy                         # crop_sheet.py
brew install --cask libreoffice                  # optional; best renderer for QA (Keynote/PowerPoint are fallbacks)
```

Run every build with `NODE_PATH=<this skill>/scripts/node_modules node build.js`.

## Stage 0 — Mode

Ask which role the user has unless the request says: **champion**, **adversary**, or **presenter**
(the default when they just say "present this paper"). Read `references/modes.md`: it fixes the arc,
slide budget, agenda icons, what the tracker counts, and the analysis prompt. For adversary and presenter
modes build the claim ledger it describes before outlining; if the `paper-review` skill is available, run
it first and lift its Champion/Adversary sections.

## Stage 1 — Read and summarize

Read the whole PDF (`pages` ranges; tables and figure captions matter most). Give, in chat: **main idea**
(one paragraph), **methodology** (numbered pipeline with key parameters, datasets, baselines),
**findings** (every headline number with its denominator and the table it comes from), **implications**
(what changes, plus limitations the paper admits). Numbers in a table beat numbers in prose; they become
stat callouts and charts later, so get them exactly right now.

## Stage 2 — Outline (gate 1)

Produce a table `# | Sentence | Visual | Badge`. Rules:

- **≤20 slides** (mode budgets in modes.md), one complete sentence per slide; the sentence *is* the slide
  text. No bullets, no title-only fragments except slide 1.
- Follow the mode's arc. Every mode has an **agenda slide** (one icon per point in a row, short label
  beneath) right after the title, and a **conclusion slide** where the same icons return carrying marks.
  The agenda is the Morph source: on each content slide the current point's icon becomes a top-right
  badge, the others shrink into a strip at the bottom, and covered points pick up ✓/✗.
- Mark every slide that needs a figure with 🖼 and say in three words what kind.
- Prefer visuals the user can build from icons and native shapes (icon rows, funnels, pipelines, jars,
  stat callouts, native tables and bar charts). Reserve generated images for hero scenes, characters, and
  symbolic icons.
- Results/claims slides each answer exactly one RQ or point and carry its icon as the badge.

End with: "Reply with changes (or 'go') and I'll write the per-slide visual, icon, and animation plan."

## Stage 3 — Per-slide plan and icon checklist (gate 2)

If the user points at a reference deck (.pptx), inspect it first (unzip media, view a few images, dump
text), record palette and style in `references/visual-style.md`, and match it. Otherwise use the house
style there.

Write the plan with `references/slide-plan-template.md`, **all nine numbered sections, those headings,
that order**; write "none" under a section that does not apply. For each slide: sentence, main idea,
visual composition (what sits left/centre/right, which numbers are 60–72 pt callouts, native chart vs
shapes), icon slugs, **animation as a click sequence using only the effects the build can write**
(Appear, Fade, Wipe from a side, Fly In from a side, Zoom, Pulse), and notes (talking line; in adversary
and presenter modes also the likely rebuttal and your answer).

Asset strategy: aim for **15–20 generated images**, shared across slides, listed in a reuse table.
Everything geometric is a native shape. Image prompts (section 8): two shared style suffixes, one subject
line per slug, "no text, no letters", and the instruction to generate **one sheet in reading order** so
`crop_sheet.py` can split it.

Save as `<PaperShortName>_slide_plan.md` in the working directory and summarize in chat. End with:
"Reply with changes (or 'go') and I'll build the deck."

## Stage 4 — Build the deck (after gate 2)

1. **Write `build.js`** next to the plan, using `scripts/deck_lib.js`. Start from
   `examples/adversary-deck/build.js`; keep one block per slide in plan order. The library gives you
   layouts (`TITLE`, `CONTENT`, `DIVIDER`), `title`, `label`, `big` (stat callout), `box`, `textBox`,
   `arrow`, `line`, `img` (picture if the slug is in the assets manifest, else a labelled dashed
   placeholder), `table` with `hdr/ok/bad/ns` cells, `barChart` with house defaults, `note`, and the
   agenda pattern: `setPoints([...])`, `agendaRow(s)`, `tracker(s, idx)`, `agendaRow(s, {marks:true})`.
   Every helper returns the object's name; pass those names to `d.anim(s, clicks)` where `clicks` is a
   list of clicks and each click a list of `[name, effect, direction?]`. Point icons keep the same name
   on every slide, which is what makes Morph move them. Finish with
   `d.finalize({ morph: [content slides], fade: [agenda slide] })`.
2. **Build**, then **post-process**: `python3 scripts/postprocess.py Deck.pptx --plan Deck.plan.json -o Deck.final.pptx`
   writes the transitions and the entrance animations into the slide XML.
3. **Validate** with the pptx skill's validator if present (`scripts/office/validate.py`); fix in the
   generator, never by hand-editing XML.
4. **Render and look at every slide**: `scripts/render.sh Deck.final.pptx qa1` (use a new prefix on every
   re-render; image viewers cache by filename). Check text overflow and cut-offs first, then overlaps,
   collisions between labels and icons, labels running past the slide edge, mid-word wraps in table
   headers, rounded chart labels. Fix, re-render only what changed, stop.
5. **Deliver**: the `.final.pptx`, the plan with section 9 (build log) filled in, and a short note on what
   is still a placeholder.

Speaker notes carry the talking line, the click sequence in words, and (adversary/presenter) the rebuttal
pre-emptions. Per-object animations are written into the file but PowerPoint lets the user retime them.

## Stage 5 — Icons

**Default: placeholders.** Every `img()` whose slug is not in the manifest renders as a dashed box
labelled with the slug, so the deck is complete and presentable before any artwork exists.

**Generate only when an image-generation tool is available in the session (for example a
`paper-illustration` skill) or the user asks for it.** Then generate the sheet from section 8, crop it,
and rebuild. Otherwise hand the user section 8 and ask for one sheet.

When a sheet arrives:
```bash
python3 scripts/crop_sheet.py sheet.png assets/                       # segments; prints block count and an indexed _contact.jpg
python3 scripts/crop_sheet.py sheet.png assets/ --names a,b,c,...      # name blocks in reading order
       [--split IDX:X] [--combine i,j=slug] [--keep-bg hero-slug] [--min-gap 8]
```
Look at `_contact.jpg` to map indices to slugs; use `--split` when two icons touched, `--combine` to also
save a pair as one asset (two related icons → one combined icon), `--keep-bg` for scenes that should
stay on white. Then `node build.js --assets assets/manifest.json`, post-process, re-render, and tell the
user which slugs are still placeholders and what else they could generate.

## Rules that keep decks consistent

- One sentence per slide, ≥26 pt, top-left; nothing else textual except short labels inside visuals.
- Never a bullet list; a list becomes an icon row, a table, or a pipeline.
- Big numbers are 60–72 pt callouts with a 12 pt label and the paper's table named.
- Agenda and conclusion are the same icon row; the conclusion adds the marks.
- Replacement pictures must keep the Selection Pane name of the placeholder they replace, or Morph fades
  instead of moving.
- Adversary mode: concession first, one slide per weakness with claim + evidence + why on the same slide,
  what-survives vs what-falls, decisive experiment, verdict. Rebuttals in notes.
- Presenter mode: the champion deck plus two or three weakness slides marked ! (caveats with a resolution),
  never a reject case; a strong paper gets one open-question slide instead.

## Things learned from past sessions

- Show the outline before any visual work; the user edits it first.
- The user builds and regenerates icons themselves; prefer icon *sets* over bespoke figure images, and ask
  for one sheet, not one file per icon.
- Keynote renders a deck anywhere on a Mac but **drops native charts** on import; say so in the build log
  and verify charts from the XML or in PowerPoint. PowerPoint's AppleScript export can hang on a dialog;
  render.sh kills it after the timeout. LibreOffice is the faithful renderer if installed.
- zsh aborts a whole command line on an unmatched glob; render.sh sets `nullglob`.
- Re-render under a new filename prefix each time; cached images made a fixed deck look unfixed.
- Sentences that quote numbers or superlatives ("strongest", "every", "all") must be re-checked row by row
  against the table they cite before the build; a first draft has been wrong on exactly this.
- Adversary talks land better when the first content slide concedes what holds and the last names the
  experiment that would change your mind.

## Reference files

- `references/modes.md` — arcs, budgets, agenda icons, and analysis prompts per mode
- `references/slide-plan-template.md` — the nine-section plan format
- `references/visual-style.md` — palette, typography, motifs (edit when a new template appears)
- `examples/adversary-deck/` — complete adversary deck: build.js, plan, icon sheet, cropped assets
