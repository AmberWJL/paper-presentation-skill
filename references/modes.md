# Presentation modes

Ask which role the user has before Stage 1 unless the request already says ("I'm the adversary", "I'm
presenting the paper", "balanced review"). The mode fixes the slide arc, the agenda icons, what the
tracker counts, and how the paper is analysed. Everything else in SKILL.md (one sentence per slide, no
bullets, icon rows instead of lists, Morph between points) applies to all three.

| | Presenter | Adversary | Balanced |
|---|---|---|---|
| Audience already knows the paper? | No | Yes (champions went first) | No |
| Slide budget | 14–20 | 8–10 | 12–16 |
| Agenda icons | the paper's RQs | what holds · 2–3 threats · what would change my mind | overview · champion · adversary · verdict |
| Tracker counts | RQs answered (✓) | threats landed (✗) | both sides heard (✓ then ✗) |
| Analysis needed | summary only | claim ledger, adversary side | claim ledger, both sides |

## Presenter (the original mode)

Arc: hook/definition → scale/why it matters → prior work fails → core diagnosis → running example →
method steps (one slide each, tracker strip highlighting the stage) → RQ slide → results (one chart per
slide, one RQ each, RQ icon as Morph badge) → comparison → human/qualitative → takeaway that echoes an
early slide. Derive 3–5 RQs from the evaluation subsections if the paper has none, and say so.

## Adversary

The champions have explained method and results; do not re-teach them. Every slide is a judgement
backed by the paper's own number, table, or sentence.

Arc (9 slides is the sweet spot):
1. Title: one line stating the thesis of the critique.
2. Agenda as an icon row: *what holds*, two or three named threats, *what would change my mind*. This
   slide is the Morph source.
3. **Concession** first. Credit the two or three results that survive. It buys credibility and tells the
   room the objections are analysis, not hostility.
4–7. **One slide per weakness**, ranked by how much of the central claim it removes. The sentence is the
   weakness; the visual is the evidence (quoted claim in a speech bubble, the table cell, the stat
   callout). Combine claim + evidence + why-it-matters on one slide; do not split them.
8. **The decisive experiment**: the smallest analysis that would change your verdict. It turns complaint
   into review.
9. **Conclusion**: the agenda icons return with marks (✓ for what holds, ✗ per threat, → for the
   experiment) and the verdict sentence, usually "reject as written, accept reframed as …".

Analysis prompt (do this before the outline; keep it internal):
- List the paper's 2–4 central claims as stated in the title, abstract, and conclusion.
- For each: evidence the paper gives (table/figure/section), the assumption that bridges evidence to
  claim, and the simplest alternative explanation.
- Classify each weakness by threat: **construct** (does the outcome variable measure the claim?),
  **internal** (confounds, selection, reverse causality, post-outcome predictors, missing controls),
  **conclusion/statistical** (significance without effect size, huge-N artefacts, multiple testing),
  **external** (does it generalise?). Give each a severity: minor / moderate / major / fatal.
- Keep only weaknesses that touch a central claim. Cosmetic issues never make a slide.
- Separate **what survives** from **what falls**; rejecting everything loses the room.
- Write the champions' likely rebuttal to each weakness and your answer into the **speaker notes**.
- Verdict vocabulary: reject as written / major revision / accept reframed, with the reframed title.
If the `paper-review` skill is available, run it first: its Adversary section and "what experiment
would change my mind" map directly onto slides 4–8.

## Balanced (both sides)

For a seminar where one person presents the paper and its critique. The deck must be fair: the champion
and adversary sections analyse the *same* claims and evidence and get comparable time.

Arc (12–16 slides):
1. Title.
2. Agenda icon row: *overview*, *champion*, *adversary*, *verdict* (Morph source).
3–5. **Overview**: problem and why it matters; method as a pipeline (tracker strip); headline result
   with its number and location. Three slides, no more; this is context, not the talk.
6. **RQ / claims slide**: one icon per central claim (2–4), labelled. These icons badge both the champion
   and adversary slides, so the audience sees the same claim examined twice.
7–9. **Champion**: strongest result, most important comparison or ablation, main implication. One claim
   per slide, badge = that claim's icon, mark ✓.
10–12. **Adversary**: for the same claims, the strongest fair objection with evidence and severity. Badge
   = the same claim icon, mark ✗ or ~ (narrowed). Same number of slides as the champion section.
13. **Core disagreement**: one sentence naming the bridging assumption the two sides read differently.
14. **Verdict**: the claim icons return with ✓ / ~ / ✗, a verdict word (strong accept … strong reject)
   and a confidence word, plus the one question to keep in mind while reading.
15. (optional) Decisive experiment.

Analysis prompt (internal, before the outline):
- Build the same claim ledger as the adversary mode: claim, evidence, bridging assumption.
- For each claim write two readings: the most favourable fair interpretation (champion) and the
  strongest fair objection (adversary), each grounded in a specific table, figure, or section.
- Decide per claim: supported / narrower than stated / unsupported. The verdict follows from the central
  claim's status, not from counting objections.
- Do not manufacture criticism to balance a strong paper, and do not soften a fatal flaw to balance a
  weak one. Symmetry of attention, not of verdict.
- Speaker notes on each champion slide carry the adversary's reply, and vice versa, so the presenter
  can field questions from either side.
If the `paper-review` skill is available, run it first: its four sections (Overview, Champion,
Adversary, Final Synthesis) are the four agenda points of this mode.
