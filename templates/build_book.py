#!/usr/bin/env python3
"""Build the complete HTML book from all fragments."""

import os
import re

BASE = "/Users/kingsonwu/programming/kingson4wu/kingson4wu.github.io.zh"
TEMPLATES = os.path.join(BASE, "templates")
CONTENT = os.path.join(BASE, "content")
OUT_HTML = os.path.join(BASE, "output", "ai-essay-book.html")

def read(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

# Build the complete HTML document
parts = []

css = read(os.path.join(TEMPLATES, "book.css"))

extra_css = """
/* 强制分页 */
.cover     { page-break-after: always; }
.toc       { page-break-after: always; }
.foreword  { page-break-after: always; }
.afterword { page-break-before: always; }
.chapter   { page-break-inside: avoid; }
"""

head = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI 时代的思考</title>
<style>
"""
head += css + extra_css
head += """
</style>
</head>
<body>
"""

parts.append(head)

# Cover
parts.append(read(os.path.join(TEMPLATES, "cover.html")))

# TOC
parts.append(read(os.path.join(TEMPLATES, "toc.html")))

# Foreword
parts.append(read(os.path.join(TEMPLATES, "foreword.html")))

# 14 chapters
for i in range(1, 15):
    chap_path = os.path.join(CONTENT, f"chap_{i:02d}.html")
    parts.append(read(chap_path))

# Afterword
parts.append(read(os.path.join(TEMPLATES, "afterword.html")))

# Close HTML
parts.append("</body>\n</html>")

html = "\n".join(parts)

os.makedirs(os.path.dirname(OUT_HTML), exist_ok=True)
with open(OUT_HTML, 'w', encoding='utf-8') as f:
    f.write(html)

size = os.path.getsize(OUT_HTML)
print(f"✓ Built {OUT_HTML} ({size:,} bytes)")
