# Presentation modes

Ask which role the user has before Stage 1 unless the request already says ("I'm the champion",
"I'm the adversary", "I'm presenting the paper"). The mode fixes the slide arc, the agenda icons, what
the tracker counts, and how the paper is analysed. Everything else in SKILL.md (one sentence per slide,
no bullets, icon rows instead of lists, Morph between points) applies to all three.

| | Champion | Adversary | Presenter |
|---|---|---|---|
| Job | make the case for the paper | make the case against it | teach the paper, then say how far to trust it |
| Audience already knows the paper? | No | Yes (champions went first) | No |
| Slide budget | 14–18 | 8–10 | 16–20 |
| Agenda icons | the paper's RQs or claims | what holds · 2–3 threats · what would change my mind | the paper's RQs or claims + one *threats* icon |
| Tracker counts | RQs answered (✓) | threats landed (✗) | RQs answered (✓), then threats raised (!) |
| Analysis needed | summary + strongest evidence | claim ledger, adversary side | summary + claim ledger, top 2–3 threats |

## Champion

Arc: hook/definition → scale/why it matters → prior work fails → core diagnosis → running example →
method steps (one slide each, tracker strip highlighting the stage) → RQ slide (one icon per RQ, Morph
source) → results (one chart per slide, one RQ each, RQ icon as badge, ✓ lands) → comparison with the
strongest baseline → human/qualitative evidence → implication → takeaway that echoes an early slide.

The champion steelmans. Lead with the strongest experimental result, the most important baseline
comparison, and the most informative ablation; say why the method could work (intuition) before how it
works (technical). Derive 3–5 RQs from the evaluation subsections if the paper has none, and say so.
Known limitations go in speaker notes as answers to likely questions, not on slides.

Analysis prompt (internal): for each central claim record the evidence (table/figure), the strongest
favourable reading, and the paper's own number for it. Verify every superlative row by row.

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

Analysis prompt (internal, before the outline):
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

## Presenter

Everything the champion deck has, then a short, fair critique before the takeaway. The audience leaves
knowing the paper *and* how much to trust it. This is the default when the user just says "present this
paper".

Arc: the champion arc through the results and comparison, trimmed by two or three slides to make room,
then:
- **Threats slide**: the tracker gains a *threats* icon (the last agenda point); one sentence framing
  "what would a careful reviewer push on".
- **2–3 weakness slides**, one per threat, each with the claim it touches, the evidence from the paper,
  and what would resolve it. Mark with ! rather than ✗: these are caveats the room should hold, not a
  reject case. Pick the threats that touch a central claim; skip anything cosmetic.
- **Takeaway** that weighs both: what to take from the paper and the one question to keep in mind.
  The agenda row returns with ✓ on the RQs and ! on threats.

Analysis prompt (internal, before the outline):
- Do the champion analysis in full.
- Build the adversary claim ledger for the 2–3 central claims only, and keep the top 2–3 threats by
  severity (major first). Phrase each as a caveat with a resolution, not a verdict.
- Speaker notes on each weakness slide carry the champion's reply, so the presenter can defend the paper
  when asked; notes on the results slides carry the caveat that applies, so the two halves stay linked.
- Do not manufacture criticism for a strong paper (one slide saying "the main open question is …" is
  enough), and do not soften a fatal flaw for a weak one (say it, mark it !, and say what would fix it).
If the `paper-review` skill is available, run it first: Overview and Champion feed the first half,
the Adversary section's top items feed the weakness slides, and "one question to keep in mind" closes.
