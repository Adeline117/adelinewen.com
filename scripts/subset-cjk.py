#!/usr/bin/env python3
"""Build the Chinese serif used behind Fraunces: Noto Serif SC cut down to the
hanzi and CJK punctuation that actually appear in the site's source.

Re-run after adding Chinese copy (any new character not in the subset falls
back to the system serif):

  curl -L -o /tmp/NotoSerifSC.ttf \
    "https://github.com/google/fonts/raw/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf"
  python3 scripts/subset-cjk.py /tmp/NotoSerifSC.ttf

Writes app/fonts/noto-serif-sc-subset.woff2 (weight axis kept, 300–600).
"""
import pathlib
import re
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES = [*ROOT.glob("components/*.tsx"), *ROOT.glob("components/*.ts"), *ROOT.glob("app/**/*.tsx")]
OUT = ROOT / "app/fonts/noto-serif-sc-subset.woff2"

# CJK ideographs, CJK symbols & punctuation, fullwidth forms, general punctuation used with hanzi
CJK = re.compile(r"[　-〿㐀-䶿一-鿿＀-￯—‘’“”…·]")


def main(src: str) -> None:
    chars = set()
    for f in SOURCES:
        chars.update(CJK.findall(f.read_text(encoding="utf-8")))
    font = TTFont(src)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    sub = subset.Subsetter(options=opts)
    sub.populate(text="".join(sorted(chars)))
    sub.subset(font)
    # only the weights the site sets (330 display, 400 body, 500 emphasis)
    font = instancer.instantiateVariableFont(font, {"wght": (300, 600)})
    OUT.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2"
    font.save(OUT)
    print(f"{len(chars)} characters -> {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
