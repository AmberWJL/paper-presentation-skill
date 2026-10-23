#!/usr/bin/env python3
"""postprocess.py — write slide transitions (Morph / Fade) and entrance animations into a .pptx.

    python3 postprocess.py deck.pptx --plan deck.plan.json -o deck.final.pptx
    python3 postprocess.py deck.pptx --morph 3-9 --fade 2 -o deck.final.pptx          # transitions only

The plan file is what deck_lib.js writes from finalize():
  {"animations": {"3": [[["stat 7 / 8","zoom"]], [["icon-bug","fade"],["lbl-x","wipe","bottom"]]], ...},
   "transitions": {"morph": [3,4,5], "fade": [2]}}
Each inner list is one click; each step is [objectName, effect, fromDirection?].
Effects: appear | fade | wipe | fly | zoom | pulse. Directions (for wipe/fly): top | bottom | left | right.

Objects are matched by their Selection Pane name (<p:cNvPr name=...>) inside the slide; names must be unique
per slide (deck_lib enforces this). Pure stdlib; deterministic; no reasoning.
"""
import argparse, json, re, sys, zipfile

MC_NS = 'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"'
P159 = 'xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main"'
P14 = 'xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main"'

MORPH = (f'<mc:AlternateContent {MC_NS}><mc:Choice {P159} Requires="p159">'
         f'<p:transition {P14} spd="slow" p14:dur="750"><p159:morph option="byObject"/></p:transition></mc:Choice>'
         '<mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>')
FADE = '<p:transition spd="med"><p:fade/></p:transition>'

# presetID / presetSubtype / filter per effect+direction (PowerPoint's own values)
WIPE = {"top": (1, "wipe(down)"), "bottom": (4, "wipe(up)"), "left": (8, "wipe(right)"), "right": (2, "wipe(left)")}
FLY = {"bottom": (4, "1+#ppt_h/2", None), "top": (1, "0-#ppt_h/2", None), "left": (8, None, "0-#ppt_w/2"), "right": (2, None, "1+#ppt_w/2")}


def parse_range(spec):
    out = set()
    for part in str(spec).split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-")
            out.update(range(int(a), int(b) + 1))
        else:
            out.add(int(part))
    return out


def shape_index(xml):
    """name -> (id, kind) for every top-level drawing object on the slide."""
    idx = {}
    for m in re.finditer(r'<p:(sp|pic|graphicFrame|grpSp|cxnSp)\b.*?<p:cNvPr id="(\d+)" name="([^"]*)"', xml, re.S):
        kind, sid, name = m.group(1), m.group(2), m.group(3)
        name = (name.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
                    .replace("&quot;", '"').replace("&apos;", "'"))
        if name not in idx:  # first wins; deck_lib keeps names unique anyway
            has_text = kind == "sp" and ("<p:txBody>" in xml[m.start(): xml.find("</p:" + kind + ">", m.start())])
            idx[name] = (sid, kind, has_text)
    return idx


class Ids:
    def __init__(self):
        self.n = 1
    def next(self):
        self.n += 1
        return self.n


def set_visible(ids, spid):
    return (f'<p:set><p:cBhvr><p:cTn id="{ids.next()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst>'
            f'</p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>')


def anim_effect(ids, spid, filt, dur=500):
    return (f'<p:animEffect transition="in" filter="{filt}"><p:cBhvr><p:cTn id="{ids.next()}" dur="{dur}"/>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>')


def anim_pos(ids, spid, attr, frm, to, dur=500):
    return (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base"><p:cTn id="{ids.next()}" dur="{dur}" fill="hold"/>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:tavLst><p:tav tm="0"><p:val><p:strVal val="{frm}"/></p:val></p:tav>'
            f'<p:tav tm="100000"><p:val><p:strVal val="{to}"/></p:val></p:tav></p:tavLst></p:anim>')


def effect_xml(ids, spid, effect, direction, node_type):
    """One <p:par> holding the effect for one shape."""
    d = direction or "bottom"
    body, preset, subtype, pclass = "", 1, 0, "entr"
    if effect == "appear":
        preset, body = 1, set_visible(ids, spid)
    elif effect == "fade":
        preset, body = 10, set_visible(ids, spid) + anim_effect(ids, spid, "fade")
    elif effect == "wipe":
        subtype, filt = WIPE[d]
        preset, body = 22, set_visible(ids, spid) + anim_effect(ids, spid, filt)
    elif effect == "fly":
        subtype, y_from, x_from = FLY[d]
        preset = 2
        body = set_visible(ids, spid)
        body += anim_pos(ids, spid, "ppt_x", x_from or "#ppt_x", "#ppt_x")
        body += anim_pos(ids, spid, "ppt_y", y_from or "#ppt_y", "#ppt_y")
    elif effect == "zoom":
        preset, subtype = 23, 16
        body = set_visible(ids, spid) + (
            f'<p:animScale><p:cBhvr><p:cTn id="{ids.next()}" dur="500" fill="hold"/><p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr>'
            f'<p:from x="0" y="0"/><p:to x="100000" y="100000"/></p:animScale>') + anim_effect(ids, spid, "fade")
    elif effect == "pulse":
        preset, pclass = 26, "emph"
        body = (f'<p:animScale><p:cBhvr><p:cTn id="{ids.next()}" dur="500" autoRev="1" fill="hold"/>'
                f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr><p:by x="105000" y="105000"/></p:animScale>')
    else:
        raise ValueError(effect)
    return (f'<p:par><p:cTn id="{ids.next()}" presetID="{preset}" presetClass="{pclass}" presetSubtype="{subtype}" fill="hold" grpId="0" nodeType="{node_type}">'
            f'<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>{body}</p:childTnLst></p:cTn></p:par>')


def timing_xml(clicks, index, slide_no):
    ids = Ids()
    root_id = ids.next()   # 2? keep PowerPoint's convention: tmRoot id=1 → we start at 1
    ids.n = 1
    parts, blds, used = [], [], set()
    for click in clicks:
        effs = []
        for i, step in enumerate(click):
            name, effect = step[0], step[1] if len(step) > 1 else "fade"
            direction = step[2] if len(step) > 2 else None
            if name not in index:
                print(f"  slide {slide_no}: no object named {name!r}; skipped", file=sys.stderr)
                continue
            spid, kind, has_text = index[name]
            effs.append(effect_xml(ids, spid, effect, direction, "clickEffect" if not effs else "withEffect"))
            if spid not in used:
                used.add(spid)
                if kind == "sp" and has_text:
                    blds.append(f'<p:bldP spid="{spid}" grpId="0" animBg="1"/>')
                elif kind == "graphicFrame":
                    blds.append(f'<p:bldGraphic spid="{spid}" grpId="0"><p:bldAsOne/></p:bldGraphic>')
        if not effs:
            continue
        parts.append(f'<p:par><p:cTn id="{ids.next()}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst>'
                     f'<p:par><p:cTn id="{ids.next()}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
                     + "".join(effs) + '</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>')
    if not parts:
        return ""
    main = (f'<p:seq concurrent="1" nextAc="seek"><p:cTn id="{ids.next()}" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
            + "".join(parts) + '</p:childTnLst></p:cTn>'
            '<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
            '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>')
    xml = ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
           + main + '</p:childTnLst></p:cTn></p:par></p:tnLst>')
    if blds:
        xml += "<p:bldLst>" + "".join(blds) + "</p:bldLst>"
    xml += "</p:timing>"
    # the tmRoot cTn uses id 1; every other id came from ids.next() starting at 2 — but effect ids were
    # allocated before the wrapper ids; uniqueness is all that matters, order is not.
    return xml


def insert_after_clrmap(xml, fragment):
    if "</p:clrMapOvr>" in xml:
        return xml.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + fragment, 1)
    return xml.replace("</p:cSld>", "</p:cSld>" + fragment, 1)


def insert_timing(xml, fragment):
    # CT_Slide order: cSld, clrMapOvr, transition, timing, extLst
    if "<p:extLst>" in xml:
        return xml.replace("<p:extLst>", fragment + "<p:extLst>", 1)
    return xml.replace("</p:sld>", fragment + "</p:sld>", 1)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pptx")
    ap.add_argument("-o", "--out", required=True)
    ap.add_argument("--plan", help="plan JSON from deck_lib finalize()")
    ap.add_argument("--morph", help="slide numbers to receive a Morph transition, e.g. 3-9,11")
    ap.add_argument("--fade", help="slide numbers to receive a Fade transition")
    ap.add_argument("--no-anim", action="store_true", help="write transitions only")
    a = ap.parse_args()

    plan = json.load(open(a.plan)) if a.plan else {"animations": {}, "transitions": {}}
    morph = set(plan.get("transitions", {}).get("morph", [])) | (parse_range(a.morph) if a.morph else set())
    fade = set(plan.get("transitions", {}).get("fade", [])) | (parse_range(a.fade) if a.fade else set())
    anims = {} if a.no_anim else {int(k): v for k, v in plan.get("animations", {}).items()}

    zin = zipfile.ZipFile(a.pptx)
    zout = zipfile.ZipFile(a.out, "w", zipfile.ZIP_DEFLATED)
    touched = []
    for item in zin.infolist():
        data = zin.read(item.filename)
        m = re.fullmatch(r"ppt/slides/slide(\d+)\.xml", item.filename)
        if m:
            n = int(m.group(1))
            xml = data.decode("utf-8")
            if "<p:transition" in xml or "<p:timing>" in xml:
                print(f"  slide {n}: already has transition/timing; left untouched", file=sys.stderr)
            else:
                what = []
                if n in morph:
                    xml = insert_after_clrmap(xml, MORPH); what.append("morph")
                elif n in fade:
                    xml = insert_after_clrmap(xml, FADE); what.append("fade")
                if n in anims:
                    t = timing_xml(anims[n], shape_index(xml), n)
                    if t:
                        xml = insert_timing(xml, t); what.append(f"{len(anims[n])} clicks")
                if what:
                    touched.append(f"slide {n}: " + ", ".join(what))
            data = xml.encode("utf-8")
        zout.writestr(item, data)
    zout.close()
    print("\n".join(touched) if touched else "nothing to do")
    print("wrote", a.out)


if __name__ == "__main__":
    main()
