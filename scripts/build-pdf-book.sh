#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# pdf-book build pipeline
#   1. Clean & convert markdown posts → HTML chapters
#   2. Assemble HTML book (cover + TOC + foreword + chapters + afterword)
#   3. Render PDF with WeasyPrint
#
# Usage: bash scripts/build-pdf-book.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

BASE="/Users/kingsonwu/programming/kingson4wu/kingson4wu.github.io.zh"
OUT_DIR="$BASE/output"
BOOK_NAME="AI思考小册子-2026"

cd "$BASE"

echo "━━━ Phase 1: Clean articles ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
python3 content/clean_articles.py

echo ""
echo "━━━ Phase 2: Build HTML book ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
python3 templates/build_book.py

echo ""
echo "━━━ Phase 3: Render PDF ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
FONTCONFIG_FILE=/tmp/fonts.conf \
  DYLD_LIBRARY_PATH=/opt/homebrew/lib:${DYLD_LIBRARY_PATH:-} \
  weasyprint \
    "$OUT_DIR/ai-essay-book.html" \
    "$OUT_DIR/$BOOK_NAME.pdf"

SIZE=$(du -h "$OUT_DIR/$BOOK_NAME.pdf" | cut -f1)
PAGES=$(python3 -c "import fitz; print(len(fitz.open('$OUT_DIR/$BOOK_NAME.pdf')))")
echo ""
echo "✓ $BOOK_NAME.pdf — $PAGES pages, $SIZE"
