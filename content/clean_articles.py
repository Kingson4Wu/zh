#!/usr/bin/env python3
"""Extract and clean blog posts into HTML chapter fragments.

Reads chapter list from docs/skills/pdf-book-bookmap.yaml.
Each chapter entry maps a source markdown file to its display title.
"""

import os
import re
import subprocess
import sys
import yaml

BASE = "/Users/kingsonwu/programming/kingson4wu/kingson4wu.github.io.zh"
POSTS_DIR = os.path.join(BASE, "source", "_posts")
OUT_DIR = os.path.join(BASE, "content")
CONFIG = os.path.join(BASE, "docs", "skills", "pdf-book-bookmap.yaml")


def load_config():
    if not os.path.exists(CONFIG):
        print(f"ERROR: config not found: {CONFIG}")
        sys.exit(1)
    with open(CONFIG, encoding='utf-8') as f:
        return yaml.safe_load(f)


def clean_content(md_content: str, filename: str) -> str:
    """Apply all cleaning rules to markdown content."""
    # Rule 1: Remove YAML frontmatter
    md_content = re.sub(r'^---\n.*?\n---\n', '', md_content, count=1, flags=re.DOTALL)

    # Rule 2: Remove AI assistant disclaimer blockquotes
    md_patterns = [
        r'\n?\n>>[^\n]*\n[ \t]+[^\n]+\n?',
        r'\n?\n>>[^\n]*\n[ \t]+[^\n]+\n[ \t]+[^\n]+\n?',
        r'\n?\n>>[^\n]*\n[ \t]+[^\n]+\n[ \t]+[^\n]+\n[ \t]+[^\n]+\n?',
        r'\n?\n>>[^\n]*\n[ \t]+[^\n]+\n[ \t]+[^\n]+\n[ \t]+[^\n]+\n[ \t]+[^\n]+\n?',
        r'\n\n##\s*AI对我理解的看法\n.*',
        r'\n\n##\s*扩\s*展\n.*',
        r'\n\n##\s*附\s*录\n.*',
        r'\n\n#\s*Reference\n.*',
        r'\n\n>>\s*AI\s*--\s*"[^"]+"\n',
    ]
    for p in md_patterns:
        md_content = re.sub(p, '', md_content, flags=re.DOTALL)

    return md_content.strip()


def clean_html(html_content: str) -> str:
    """Remove AI disclaimer phrases from pandoc-generated HTML."""
    html_content = re.sub(
        r'<blockquote>\s*<p>\s*以下[^\n<]*</p>\s*</blockquote>', '', html_content)
    html_content = re.sub(
        r'<blockquote>\s*<p>\s*>>[^\n<]*</p>\s*</blockquote>', '', html_content)
    html_content = re.sub(
        r'<p>[^<]*以下内容由[A-Za-z/]+辅助生成[^<]*</p>', '', html_content)
    html_content = re.sub(
        r'<p>\s*From chatGPT\s*\([^)]+\)\s*</p>', '', html_content)
    return html_content


def md_to_html(md_text: str) -> str:
    """Convert markdown to HTML via pandoc."""
    result = subprocess.run(
        ['pandoc', '-f', 'markdown', '-t', 'html', '--wrap=none', '--no-highlight'],
        input=md_text,
        capture_output=True, text=True, encoding='utf-8'
    )
    if result.returncode != 0:
        print(f"  pandoc warning: {result.stderr.strip()}", flush=True)
    return result.stdout.strip()


def build_chapter_html(title: str, body_html: str, idx: int) -> str:
    body_html = clean_html(body_html)
    padded = f"{idx:02d}"
    return f'<div class="chapter">\n<h1 class="chapter-title">{title}</h1>\n{body_html}\n</div>\n'


def main():
    config = load_config()
    chapters = config.get('chapters', [])

    if not chapters:
        print("No chapters found in config.")
        sys.exit(1)

    print(f"Config: {CONFIG}")
    print(f"Posts dir: {POSTS_DIR}")
    print(f"Output dir: {OUT_DIR}")
    print(f"Chapters: {len(chapters)}\n")

    os.makedirs(OUT_DIR, exist_ok=True)

    for idx, entry in enumerate(chapters, start=1):
        src_file = entry[0]
        title = entry[1]
        out_name = f"chap_{idx:02d}.html"
        src_path = os.path.join(POSTS_DIR, src_file)

        print(f"  [{idx:02d}] {src_file} → {out_name}", end=" ", flush=True)

        if not os.path.exists(src_path):
            print(f"\n  ERROR: file not found: {src_path}")
            continue

        with open(src_path, encoding='utf-8') as f:
            raw = f.read()

        cleaned = clean_content(raw, src_file)
        body_html = md_to_html(cleaned)
        chapter_html = build_chapter_html(title, body_html, idx)

        out_path = os.path.join(OUT_DIR, out_name)
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(chapter_html)

        print(f"✓ ({len(body_html)} chars HTML)")

    print(f"\nDone — {len(chapters)} chapters written to {OUT_DIR}/")


if __name__ == '__main__':
    main()
