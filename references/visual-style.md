# House style (from the user's reference deck and asset set)

Layout: white background, 16:9. Title is the single sentence, top-left, 26–32 pt. Slide number bottom-right. Nothing else textual except short labels inside diagrams or a one-line quote in a speech bubble.

## Illustration style (matches `examples/adversary-deck/assets`)

Flat "sticker" icons: every shape closed by a heavy near-black outline (about 2.5–3 % of the icon's width), rounded corners and rounded line ends, no gradients, one flat fill per region plus at most one lighter highlight band. Objects sit on nothing (transparent background), centred, filling ~80 % of a square canvas.

- **Icons** are everyday objects with one twist that carries the meaning: a tilted seesaw with a question mark (unbalanced conclusion), a document with a red exclamation badge and checklist (overstated claim), a document under a magnifier (scrutiny), a flask with bubbles (experiment), a sheet with three coloured lines (a patch).
- **Characters** are chibi developers: large round head, tiny dot eyes, pink cheek blush, no nose or mouth detail, hair as one flat shape, sitting behind a laptop whose lid faces the viewer. Meaning is carried by one prop: a speech bubble with "?" for newcomer or uncertainty, a teal circle with a check for established or accepted, a stack of sheets for many patches.
- **Marks** are drawn, not typed: check in a teal circle, exclamation in a coral circle, question mark in a teal bubble.

## Icon palette (fills seen in the asset set)

- outline near-black 000000
- paper / screen lavender-white E4E4FC, EEF0FA
- laptop / desk slate 546C84, dark slate 54546C
- teal 3CCC9C (checks, bubbles, accepted)
- coral E48484 (alert badge, red shirt, wrong)
- navy 3C5484 (hair, dark accents)
- lilac 846C84 (secondary accents)
- peach skin FCB484, E4B484
- sky blue 4FA3E8 (handles, tape), warm yellow F5C542 (bookmarks, small highlights)

## Slide palette (shapes, text, charts, tracker)

- slate blue 4A6FA5 (primary)
- sage green 8FAF9A (secondary)
- light blue CFE3F0 (fills)
- charcoal 2E3A46 (text / outlines)
- red E63946 (wrong, flaky, problem)
- green 4CAF7A (fixed, accepted)
- grey 9AA5B1 (pruned / inactive)

Icons bring their own fills; the slide palette is for everything drawn in PowerPoint. The two agree on slate, red and green, so marks and badges read as one system.

## Prompt suffixes (copy into section 8 of the plan)

**Icon suffix:** flat sticker icon, heavy near-black outline, rounded corners, flat fills with one light highlight band, no gradients, no shadow, colours from: lavender-white #E4E4FC, slate #546C84, teal #3CCC9C, coral #E48484, navy #3C5484, lilac #846C84, sky blue #4FA3E8, warm yellow #F5C542; centred on a transparent square, fills 80 % of the canvas, no text, no letters, no numbers.

**Character suffix:** chibi developer, large round head, tiny dot eyes, pink cheek blush, no nose, hair as one flat shape, sitting behind a laptop facing the viewer, heavy near-black outline, flat fills, skin #FCB484, laptop #546C84, shirt coral #E48484 or sky blue #4FA3E8; one prop only (teal "?" speech bubble, teal check circle, or stack of sheets); transparent square, no text, no letters.

Batch tip: generate one sheet in reading order with clear gaps so `scripts/crop_sheet.py` can split it; generate the base character first and reuse it as the style reference for the others.

## Recurring motifs

- A tracker strip repeated across content slides (agenda icons shrunk to the bottom, current point as a top-right badge, ✓/✗/! accumulating). Mirror it with a pipeline strip for method papers.
- Comparison slides as left/right halves with a character or icon on each side.
- Quotes from the paper in a speech bubble with a small source tag.
- Logos of real tools used as-is; otherwise neutral characters.

Typography: title ≥26 pt bold, stat callouts 60–72 pt with 12–14 pt label, diagram labels 12–16 pt. No accent bars, no underlines under titles.
