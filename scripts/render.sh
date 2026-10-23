#!/bin/zsh
# render.sh — turn a .pptx into per-slide JPGs for visual QA, trying renderers in order:
#   1. LibreOffice (soffice)        faithful, headless
#   2. Keynote via AppleScript      opens anywhere on a Mac, but DROPS NATIVE CHARTS on import
#   3. PowerPoint via AppleScript   faithful, but can hang on a dialog; killed after the timeout
#
#   render.sh deck.pptx out_prefix [dpi]
#   → out_prefix-1.jpg … and prints which renderer was used. Use a NEW prefix for every re-render:
#     image viewers (and Claude's Read tool) cache by filename.
setopt nullglob
set -u
deck="$1"; prefix="${2:-render}"; dpi="${3:-110}"
[[ -f "$deck" ]] || { echo "no such file: $deck" >&2; exit 1; }
abs=$(cd "$(dirname "$deck")" && pwd)/$(basename "$deck")
pdf="${abs%.pptx}.$prefix.pdf"
rm -f "$pdf" "$prefix"-*.jpg
used=""

if command -v soffice >/dev/null 2>&1; then
  soffice --headless --convert-to pdf --outdir "$(dirname "$abs")" "$abs" >/dev/null 2>&1 && \
    mv "${abs%.pptx}.pdf" "$pdf" 2>/dev/null && used="libreoffice"
fi

if [[ -z "$used" && -d "/Applications/Keynote.app" ]]; then
  osascript - "$abs" "$pdf" <<'EOF' >/dev/null 2>&1
on run argv
  with timeout of 120 seconds
    tell application "Keynote"
      set theDoc to open POSIX file (item 1 of argv)
      export theDoc to POSIX file (item 2 of argv) as PDF
      close theDoc saving no
    end tell
  end timeout
end run
EOF
  [[ -f "$pdf" ]] && used="keynote (native charts are NOT rendered by Keynote; verify charts in PowerPoint or the XML)"
fi

if [[ -z "$used" && -d "/Applications/Microsoft PowerPoint.app" ]]; then
  osascript - "$abs" "$pdf" <<'EOF' >/dev/null 2>&1
on run argv
  with timeout of 90 seconds
    tell application "Microsoft PowerPoint"
      open POSIX file (item 1 of argv)
      set thePres to active presentation
      save thePres in POSIX file (item 2 of argv) as save as PDF
      close thePres saving no
    end tell
  end timeout
end run
EOF
  [[ -f "$pdf" ]] && used="powerpoint" || pkill -x "Microsoft PowerPoint" 2>/dev/null
fi

[[ -n "$used" ]] || { echo "no renderer produced a PDF (install LibreOffice: brew install --cask libreoffice)" >&2; exit 2; }
command -v pdftoppm >/dev/null || { echo "pdftoppm (poppler) missing; PDF is at $pdf" >&2; exit 3; }
pdftoppm -jpeg -r "$dpi" "$pdf" "$prefix"
echo "renderer: $used"
ls -1 "$PWD"/"$prefix"-*.jpg
