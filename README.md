# paper-presentation

A Claude Code skill that turns an academic paper (PDF or arXiv link) into a visual-first slide presentation plan for a seminar or reading-group talk.

## What it produces

A fixed eight-section Markdown plan (`<Paper>_slide_plan.md`):

1. **Paper summary** — main idea, methodology, findings table, implications
2. **Outline** — ≤20 slides, exactly one sentence per slide, no bullet points, one RQ column
3. **Asset strategy** — 15–20 reusable generated images plus PowerPoint shapes, with a reuse table
4. **Recurring motifs** — a pipeline tracker strip and research-question icons that Morph into badges on the results slides
5. **Slides** — per slide: sentence, main idea, visual composition, click-by-click animation
6. **Morph setup notes**
7. **Native charts**
8. **Image-generation prompts** — one line per asset with shared style suffixes

The skill stops after the outline so you can edit it before any visual work.

## Install

Copy this folder to `~/.claude/skills/paper-presentation/` (or your project's `.claude/skills/`). Then ask Claude Code to "present this paper" or run `/paper-presentation`.

## Files

```
paper-presentation/
├── SKILL.md                          workflow and rules
└── references/
    ├── slide-plan-template.md        the fixed plan format
    └── visual-style.md               house style of the reference deck (edit for yours)
```

`references/visual-style.md` currently describes one specific course template; replace the palette and motifs with your own deck's.
