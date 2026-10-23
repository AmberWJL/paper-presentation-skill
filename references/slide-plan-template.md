# <Paper short title> – <N>-slide plan

**Paper:** <full title>, <authors>, <venue/arXiv id>, <year>
**Mode:** presenter | adversary | balanced (see references/modes.md)
**Reference deck:** <template .pptx used for style, or "house style">
**Palette:** <name hex> · <name hex> · … (one line)

## 1. Paper summary
**Main idea:** <one paragraph>
**Methodology:** <numbered pipeline, 3–6 steps, key parameters inline>
**Findings:** <table: metric | value | denominator/context>
**Implications:** <3–5 sentences, including limitations the paper admits>
(adversary / balanced: add **Claim ledger:** claim | evidence | bridging assumption | champion reading | adversary challenge | severity)

## 2. Outline
| # | Sentence | Visual type | Badge / RQ |
|---|---|---|---|
| 1 | <one sentence> | <funnel / Venn / call chain / hero…> | – |
| … | … | … | <point slug or RQn> |

## 3. Asset strategy (<N> generated images + PowerPoint shapes)
| Slug | What | Reused on |
|---|---|---|
| … | … | <slide numbers> |

**Variants by overlay:** <slug + overlay → meaning, one line each>
**Shapes used as icons:** <comma list>

## 4. Recurring motifs
**Tracker strip:** <points, which slides, highlight rule, where the ✓/✗ land>
**Point icons with Morph:** <agenda slide #, slug per point, content slide → badge mapping, closing slide behaviour>

## 5. Slides
### <n> · <label>
Sentence: <the single sentence on the slide>
Main idea: <one line>
Visual: <composition left/centre/right; stat callouts; native chart vs shapes; numbers from the paper; which slugs and which shapes>
Animation: <click 1 …; click 2 …> — only effects the build can write into the file:
  Appear · Fade · Wipe from top/bottom/left/right · Fly In from top/bottom/left/right · Zoom · Pulse.
  Name objects as the build will name them (slug, "stat 5.57×", "table-xi-flips" …).
Notes: <talking line; adversary/balanced also carry the likely rebuttal and your answer>

(repeat for every slide)

## 6. Morph setup notes
<Morph source slide, the point names, badge position/size, strip position, which slides get Morph, closing slide reassembly; replacement pictures must keep the same Selection Pane name>

## 7. Native charts and tables
<slide #>: <chart type / table> <values and their source table in the paper>

## 8. Image-generation prompts (<N>)
**Icon suffix:** <style, palette hex, transparent, square, no text>
**Character suffix:** <style>
1. **<slug>** — <subject line>. + <icon|character> suffix
…
**Batch tips:** <one sheet in reading order, seed/style reference, base character first, transparent PNG>

## 9. Build log
Deck: <path to .final.pptx> · Plan JSON: <path>
Renderer used for QA: <libreoffice | keynote (charts not shown) | powerpoint>
QA fixes: <one line each>
Assets still placeholders: <slugs, or "none">
