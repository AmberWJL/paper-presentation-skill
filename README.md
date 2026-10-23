# paper-presentation

A Claude Code skill that turns an academic paper (PDF or arXiv link) into a visual-first seminar talk:
a fixed-format slide plan **and a built .pptx** with one sentence per slide, no bullets, icon rows
instead of lists, Morph transitions between points, click-by-click entrance animations, native charts
and tables, and speaker notes.

## Three modes

| Mode | When | Arc |
|---|---|---|
| **presenter** | you present the paper | hook → why it matters → prior work → method (tracker strip) → RQs → results → takeaway |
| **adversary** | the champions went first, you argue the reject case | concession → one slide per weakness → decisive experiment → verdict |
| **balanced** | you present and review | overview → claims → champion → adversary (same claims) → core disagreement → verdict |

Details and the analysis prompts are in `references/modes.md`.

## Workflow

1. Read the paper, pick the mode, summarise.
2. Outline (≤20 one-sentence slides) → **you approve**.
3. Per-slide plan: visuals, icons, animations, Morph notes, image prompts → **you approve**.
4. Build the deck with `scripts/deck_lib.js`; `scripts/postprocess.py` writes Morph/Fade transitions and
   the entrance animations into the file; render and QA with `scripts/render.sh`.
5. Icons: dashed, labelled placeholders by default. If an image-generation tool is available or you ask,
   the skill generates them; otherwise you generate one sheet from section 8 of the plan and
   `scripts/crop_sheet.py` splits it by slug and the deck is rebuilt with the pictures.

## Install

```bash
cp -r paper-presentation ~/.claude/skills/paper-presentation
cd ~/.claude/skills/paper-presentation/scripts && npm install        # pptxgenjs + jszip, once
pip install pillow numpy                                               # for crop_sheet.py
brew install --cask libreoffice                                        # optional: best renderer for QA
```

Then ask Claude Code to "present this paper", "I'm the adversary for this paper", or run `/paper-presentation`.

## Files

```
paper-presentation/
├── SKILL.md                         workflow, rules, QA
├── references/
│   ├── modes.md                     presenter / adversary / balanced arcs and analysis prompts
│   ├── slide-plan-template.md       the fixed nine-section plan format
│   └── visual-style.md              house style (palette, typography, motifs) — edit for your deck
├── scripts/
│   ├── deck_lib.js                  pptxgenjs helpers: layouts, placeholders↔images, agenda/badge/strip, tables, charts, animation plan
│   ├── postprocess.py               writes Morph/Fade transitions + entrance animations (Appear/Fade/Wipe/Fly/Zoom/Pulse)
│   ├── crop_sheet.py                splits a generated icon sheet into named PNGs + manifest.json
│   ├── render.sh                    pptx → slide JPGs via LibreOffice → Keynote → PowerPoint
│   ├── apply_theme.js               writes theme colours into the deck (from the pptx skill)
│   └── package.json                 node deps
└── examples/firstpatch-adversary/   a complete adversary deck: build.js, plan, icon sheet, cropped assets
```
