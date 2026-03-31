# PDF Booklet Skill

将博客文章编译为可印刷的 PDF 小册子。

## 快速开始

```bash
# 1. 编辑配置
vim docs/skills/pdf-book-bookmap.yaml

# 2. 一键构建
bash scripts/build-pdf-book.sh
# 输出: output/AI思考小册子-2026.pdf
```

## 工作原理

```
_posts/*.md         源文章（Hexo markdown）
      ↓ clean_articles.py（读取 yaml 配置）
content/chap_*.html 章节 HTML 片段
      ↓ build_book.py + WeasyPrint
output/ai-essay-book.html 完整 HTML
      ↓ WeasyPrint
output/[book-name].pdf
```

## 配置说明

编辑 `docs/skills/pdf-book-bookmap.yaml`：

| 字段 | 作用 |
|------|------|
| `title` / `subtitle` / `author` | 封面显示 |
| `disclaimer` | 封面免责文字 |
| `foreword` / `afterword` | 前言/后记内容（留空则用模板） |
| `chapters` | 文章列表：`[文件名, 标题]` |

## 模板文件

| 文件 | 作用 |
|------|------|
| `templates/cover.html` | 封面 |
| `templates/toc.html` | 目录 |
| `templates/foreword.html` | 前言 |
| `templates/afterword.html` | 后记 |
| `templates/book.css` | 印刷样式（字体、边距、水印等） |
| `templates/build_book.py` | HTML 组装脚本 |

## 常见需求

**增删/重排章节**：改 `bookmap.yaml` 里的 `chapters` 列表，然后重新跑脚本。

**修改封面**：编辑 `templates/cover.html`。

**修改水印文字**：编辑 `templates/book.css` 中的 `@page { @bottom-right { content: "..."; } }`。

**新增清洗规则**（过滤 AI 免责声明等）：编辑 `content/clean_articles.py` 中的 `md_patterns` 和 `clean_html()`。

## 依赖

- `pandoc` — markdown → HTML
- `weasyprint` — HTML → PDF（macOS 需 `DYLD_LIBRARY_PATH=/opt/homebrew/lib`）
- `PyMuPDF`（pip）— 验证 PDF 页数
