#!/usr/bin/env python3
"""crop_sheet.py — split a generated icon sheet into named PNG assets + manifest.json for deck_lib.img().

    python3 crop_sheet.py sheet.webp assets/ --names pt-holds,thr-construct,...   # names in reading order
    python3 crop_sheet.py sheet.webp assets/                                       # just segment: writes _contact.jpg with indices
    python3 crop_sheet.py sheet.webp assets/ --names ... --combine 2,3=thr-internal --split 6:639

Segmentation uses the alpha channel when the sheet has one, else "not near-white". Blocks are found by
row bands then column gaps (reading order). When two icons touch, use --split INDEX:X to cut block INDEX
at pixel column X, or lower --min-gap. --combine i,j=slug also saves blocks i and j together as one asset.
Deterministic; needs Pillow + numpy.
"""
import argparse, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw


def mask_of(im):
    a = np.asarray(im)
    if im.mode == "RGBA" and a[:, :, 3].min() < 250:
        return a[:, :, 3] > 20
    rgb = a[:, :, :3].astype(int)
    return rgb.min(axis=2) < 235


def bands(mask, min_h=40):
    rows = mask.sum(axis=1) > 3
    out, s = [], None
    for y, v in enumerate(rows):
        if v and s is None:
            s = y
        if not v and s is not None:
            if y - s > min_h:
                out.append((s, y))
            s = None
    if s is not None:
        out.append((s, mask.shape[0]))
    return out


def segments(mask, y0, y1, min_gap, min_w=40):
    cols = mask[y0:y1].sum(axis=0) > 2
    segs, st, gap = [], None, 0
    for x, v in enumerate(cols):
        if v:
            if st is None:
                st = x
            gap = 0
        elif st is not None:
            gap += 1
            if gap >= min_gap:
                e = x - gap
                if e - st > min_w:
                    segs.append((st, e))
                st, gap = None, 0
    if st is not None:
        segs.append((st, mask.shape[1]))
    return segs


def tight(mask, x0, y0, x1, y1):
    sub = mask[y0:y1, x0:x1]
    ys = np.where(sub.any(axis=1))[0]
    xs = np.where(sub.any(axis=0))[0]
    if len(ys) == 0 or len(xs) == 0:
        return (x0, y0, x1, y1)
    return (x0 + int(xs.min()), y0 + int(ys.min()), x0 + int(xs.max()) + 1, y0 + int(ys.max()) + 1)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("sheet")
    ap.add_argument("outdir")
    ap.add_argument("--names", help="comma-separated slugs in reading order (left-to-right, top-to-bottom)")
    ap.add_argument("--combine", action="append", default=[], help="i,j=slug  save blocks i and j together as one asset")
    ap.add_argument("--split", action="append", default=[], help="INDEX:X  cut block INDEX at pixel column X before naming")
    ap.add_argument("--min-gap", type=int, default=12, help="minimum empty columns between two blocks (default 12)")
    ap.add_argument("--pad", type=int, default=6)
    ap.add_argument("--keep-bg", default="", help="comma-separated slugs to composite on white instead of transparent (scenes)")
    a = ap.parse_args()

    im = Image.open(a.sheet).convert("RGBA")
    W, H = im.size
    mask = mask_of(im)
    boxes = []
    for (y0, y1) in bands(mask):
        for (x0, x1) in segments(mask, y0, y1, a.min_gap):
            boxes.append(tight(mask, x0, y0, x1, y1))
    for spec in a.split:
        i, x = spec.split(":")
        i, x = int(i), int(x)
        bx = boxes[i]
        boxes[i:i + 1] = [tight(mask, bx[0], bx[1], x, bx[3]), tight(mask, x, bx[1], bx[2], bx[3])]

    out = Path(a.outdir)
    out.mkdir(parents=True, exist_ok=True)
    # contact sheet with indices, always written
    sheet = im.copy()
    d = ImageDraw.Draw(sheet)
    for i, b in enumerate(boxes):
        d.rectangle(b, outline=(230, 57, 70, 255), width=3)
        d.rectangle((b[0], b[1], b[0] + 34, b[1] + 22), fill=(230, 57, 70, 255))
        d.text((b[0] + 6, b[1] + 4), str(i), fill=(255, 255, 255, 255))
    bg = Image.new("RGBA", sheet.size, (255, 255, 255, 255))
    bg.alpha_composite(sheet)
    bg.convert("RGB").save(out / "_contact.jpg", quality=85)
    print(f"{len(boxes)} blocks; indexed contact sheet: {out / '_contact.jpg'}")

    if not a.names:
        for i, b in enumerate(boxes):
            print(f"  {i}: x={b[0]}-{b[2]} y={b[1]}-{b[3]}")
        return
    names = [n.strip() for n in a.names.split(",") if n.strip()]
    if len(names) != len(boxes):
        sys.exit(f"{len(names)} names but {len(boxes)} blocks. Check {out / '_contact.jpg'}; use --split/--min-gap/--combine.")

    keep_bg = {s.strip() for s in a.keep_bg.split(",") if s.strip()}
    manifest = {}

    def save(slug, box):
        x0, y0, x1, y1 = box
        crop = im.crop((max(0, x0 - a.pad), max(0, y0 - a.pad), min(W, x1 + a.pad), min(H, y1 + a.pad)))
        if slug in keep_bg:
            white = Image.new("RGBA", crop.size, (255, 255, 255, 255))
            white.alpha_composite(crop)
            crop = white
        crop.save(out / f"{slug}.png")
        manifest[slug] = {"file": f"{slug}.png", "w": crop.size[0], "h": crop.size[1]}

    for slug, box in zip(names, boxes):
        save(slug, box)
    for spec in a.combine:
        idxs, slug = spec.split("=")
        sel = [boxes[int(i)] for i in idxs.split(",")]
        save(slug, (min(b[0] for b in sel), min(b[1] for b in sel), max(b[2] for b in sel), max(b[3] for b in sel)))

    json.dump(manifest, open(out / "manifest.json", "w"), indent=1)
    print(f"wrote {len(manifest)} assets + manifest.json to {out}")


if __name__ == "__main__":
    main()
