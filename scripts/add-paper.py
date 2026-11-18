#!/usr/bin/env python3
"""Put a paper on the site under the one naming scheme every paper follows.

  public/papers/<FirstAuthorSurname><Year>-<Short-Title>-<Venue>.pdf

The PDF's own title, author and subject fields are set too, so the browser tab, the
download and search engines all show the paper's real title rather than a file name.
For IEEE papers (--ieee) the accepted manuscript gets the notice IEEE requires on an
author's own site: the copyright line, the personal-use statement and the citation.

  python3 scripts/add-paper.py SRC.pdf --first Wen --year 2026 --short HasciDB --venue NBC \
      --title "..." --authors "A, B, C" --cite "Venue, place, dates"
"""
import argparse
import os

import fitz  # PyMuPDF

IEEE = (
    "© {year} IEEE. Personal use of this material is permitted. Permission from IEEE must be obtained for all "
    "other uses, in any current or future media, including reprinting/republishing this material for advertising "
    "or promotional purposes, creating new collective works, for resale or redistribution to servers or lists, or "
    "reuse of any copyrighted component of this work in other works. Accepted manuscript of: {authors}, \"{title},\" "
    "in {cite}, {year}."
)

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("--first", required=True)
ap.add_argument("--year", required=True)
ap.add_argument("--short", required=True)
ap.add_argument("--venue", required=True)
ap.add_argument("--title", required=True)
ap.add_argument("--authors", required=True)
ap.add_argument("--cite", required=True)
ap.add_argument("--ieee", action="store_true")
a = ap.parse_args()

name = f"{a.first}{a.year}-{a.short}-{a.venue}.pdf"
out = os.path.join(os.path.dirname(__file__), "..", "public", "papers", name)

doc = fitz.open(a.src)
if a.ieee:
    page = doc[0]
    box = fitz.Rect(54, page.rect.height - 50, page.rect.width - 54, page.rect.height - 12)
    left = page.insert_textbox(box, IEEE.format(year=a.year, authors=a.authors, title=a.title, cite=a.cite),
                               fontname="tiro", fontsize=6.5, align=fitz.TEXT_ALIGN_JUSTIFY)
    assert left >= 0, "IEEE notice does not fit the bottom margin"
meta = doc.metadata
meta.update(title=a.title, author=a.authors, subject=f"{a.cite}, {a.year}")
doc.set_metadata(meta)
doc.save(out, garbage=3, deflate=True)
print(f"/papers/{name}")
