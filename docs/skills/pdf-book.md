---
name: pdf-book
description: Build a printable PDF booklet from selected Hexo blog posts — config-driven, WeasyPrint rendering, per-chapter named-page headers
---

# PDF Book — Build a Printable Booklet from Blog Posts

## Overview

Compile selected blog posts into a typeset PDF book with cover, TOC, foreword, chapters, and afterword. The pipeline is **config-driven**: one YAML file lists the posts and their order; everything else is automated.

**Pipeline phases:**

```
_posts/*.md           (source markdown)
       ↓ clean_articles.py (strips AI disclaimers, converts to HTML)
content/chap_XX.html  (chapter HTML fragments)
       ↓ build_book.py    (assembles + WeasyPrint)
output/ai-essay-book.html  (complete HTML)
       ↓ WeasyPrint
output/[book-name].pdf
```

**Prerequisites:** pandoc, weasyprint (system), PyMuPDF (pip). WeasyPrint on macOS requires `DYLD_LIBRARY_PATH=/opt/homebrew/lib`.

---

## Phase 1 — Configure the Book Map

Edit `docs/skills/pdf-book-bookmap.yaml`. Each entry maps one source markdown file to one chapter output.

```yaml
# PDF metadata
title: "「AI 时代的思考」"
subtitle: "从认知革命到商业落地"
author: "Kingson Wu"
date: "2026 年 3 月"

# Disclaimer shown on cover
disclaimer: |
  ⚠ 本册写于 2025–2026 年，部分观点可能已有变化、存在错误，
  或视角狭隘、覆盖不全。请批判性阅读。

# Foreword body (markdown → HTML, leave empty to use templates/foreword.html)
foreword: ""

# Afterword body (markdown → HTML, leave empty to use templates/afterword.html)
afterword: ""

# Chapters: source filename → [display title]
chapters:
  - ["20241231-AI工业革命下的若干思考.md", "AI工业革命下的若干思考"]
  - ["20250213-深度学习为什么能学习并做对.md", "深度学习为什么能学习并做对"]
  - # ... add/remove/reorder freely
```

> **Source file location:** posts are in `source/_posts/`. Match the filename exactly (including the `.md` extension).

---

## Phase 2 — Clean Articles

Run the cleaning script to strip AI disclaimer phrases and convert markdown → HTML:

```bash
python3 content/clean_articles.py
```

This reads `docs/skills/pdf-book-bookmap.yaml`, extracts each listed markdown file, cleans it, and writes `content/chap_01.html` … `chap_NN.html`.

**What gets stripped automatically:**
- YAML frontmatter
- `>>` AI blockquote patterns
- `## AI对我理解的看法` and `## 扩展 / 附录` sections
- `# Reference` sections
- `<p>From chatGPT (...)</p>` paragraphs
- Pandoc-generated `<blockquote>` AI disclaimer blocks

**To add new strip rules:** edit the `md_patterns` list and `clean_html()` function in `content/clean_articles.py`.

---

## Phase 3 — Update Static Templates

Before building, update these files if content changed:

| File | What to edit |
|------|-------------|
| `templates/cover.html` | Title, subtitle, author, date, disclaimer text |
| `templates/toc.html` | Part headings and chapter list (auto-generated option TODO) |
| `templates/foreword.html` | Foreword body (or set `foreword: ""` in YAML to use existing) |
| `templates/afterword.html` | Afterword body (or set `afterword: ""` in YAML to use existing) |
| `templates/book.css` | Fonts, colors, margins, watermark text, page headers |

---

## Phase 4 — Build & Render PDF

```bash
python3 templates/build_book.py
```

Then render to PDF:

```bash
# Standard
weasyprint output/ai-essay-book.html output/[book-name].pdf

# macOS (Homebrew weasyprint needs DYLD_LIBRARY_PATH)
FONTCONFIG_FILE=/tmp/fonts.conf \
  DYLD_LIBRARY_PATH=/opt/homebrew/lib:$DYLD_LIBRARY_PATH \
  weasyprint output/ai-essay-book.html output/[book-name].pdf
```

**Verify page count** (should be reasonable, not 100+):

```bash
python3 -c "
import fitz
doc = fitz.open('output/[book-name].pdf')
print(f'Pages: {len(doc)}')
for i in range(min(5, len(doc))):
    print(f'  p{i+1}: {doc[i].get_text().split(chr(10))[0]}')
"
```

---

## Customization Reference

### Fonts (CSS)
```css
body { font-family: "Songti SC", "STHeiti Medium", serif; }
```

### Watermark
```css
@page { @bottom-right { content: "Your Name · Year"; } }
```

### Page margins
```css
@page { margin: 2.2cm 2.8cm 2.5cm 2.8cm; }
```

### Cover decoration
Add a vertical accent bar by including `<div class="cover-accent-bar"></div>` before the title in `cover.html`.

### Page headers (chapter name top-left)
Named-page headers via per-chapter `style="page: chapter-XX"` on `<div class="chapter">`. This works reliably for single-page chapters but may not persist across page breaks in some WeasyPrint versions. Test after adding new content.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| PDF has 100+ pages | WeasyPrint is applying `page-break-before: always` too aggressively — check that chapter divs have no extra whitespace or nested page-break styles |
| Chinese text renders as boxes | Font not found — confirm `"Songti SC"` or `"STHeiti Medium"` is available via `fc-list :lang=zh` |
| WeasyPrint `OSError: cannot load libpango` | Set `DYLD_LIBRARY_PATH=/opt/homebrew/lib` on macOS |
| AI disclaimers still appear | Run `clean_articles.py` again after adding new patterns |
| Named-page header only shows on first page | Known WeasyPrint limitation for multi-page named pages — use per-element `style="page: chapter-XX"` with caution |
