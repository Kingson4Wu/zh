# AI 思考小册子：实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan.

**Goal:** 将 14 篇博客文章整合为一册可打印 PDF（严谨学术风格），包含封面、目录、前言、后记，支持水印。

**Architecture:** 通过 pandoc 将 Markdown 转为 HTML片段 → Python 脚本清理内容并拼接为单本 HTML → weasyprint 渲染 PDF + 水印

**Tech Stack:** pandoc 3.8.3, weasyprint 68.1, Python 3, CSS @page

---

## 任务总览

```
Task 1  创建目录结构
Task 2  提取并清理 14 篇文章（移除 frontmatter、AI辅助说明、参考文献等）
Task 3  生成封面 HTML
Task 4  生成前言
Task 5  生成目录（HTML）
Task 6  生成后记
Task 7  拼接所有内容为完整 HTML + CSS
Task 8  weasyprint 渲染 PDF（加水印）
Task 9  验证输出
```

---

## Task 1: 创建目录结构

**文件：**
- 创建: `output/`（PDF 输出目录）
- 创建: `content/`（清理后的文章 HTML 片段）
- 创建: `templates/`（HTML 模板和 CSS）

```bash
mkdir -p output content templates
```

- [ ] 创建 `content/`、`templates/`、`output/` 目录

---

## Task 2: 提取并清理 14 篇文章

**文件：**
- 创建: `content/clean_articles.py`
- 输出: `content/chap_*.html`（14 个文件）

**Python 脚本内容（clean_articles.py）：**

```python
#!/usr/bin/env python3
"""提取并清理 14 篇博客文章，输出干净的 HTML 片段"""

import re
import os

POSTS_DIR = "/Users/kingsonwu/programming/kingson4wu/kingson4wu.github.io.zh/source/_posts"

articles = [
    # (filename, output_name, part_num, title)
    ("20241231-AI工业革命下的若干思考.md", "chap_01.html", "第一部分：理解 AI", "AI工业革命下的若干思考"),
    ("20250213-深度学习为什么能学习并做对.md", "chap_02.html", "", "深度学习为什么能学习并做对"),
    ("20260204-人类与模型的共同特征：直觉先行，解释在后.md", "chap_03.html", "", "人类与模型的共同特征：直觉先行，解释在后"),
    ("20250213-关于AI替代人类工作的问题.md", "chap_04.html", "第二部分：人机关系", "关于AI替代人类工作的问题"),
    ("20260331-技术进步与分配失衡：AI时代的结构性矛盾.md", "chap_05.html", "", "技术进步与分配失衡：AI时代的结构性矛盾"),
    ("20260204-从-Prompt-到碳基-Agentic-RAG：AI-时代的人类认知外化.md", "chap_06.html", "", "从Prompt到碳基Agentic RAG：AI时代的人类认知外化"),
    ("20260209-AI与学习型人际关系的变化.md", "chap_07.html", "", "AI与学习型人际关系的变化"),
    ("20260204-AI能否创造真正的新事物.md", "chap_08.html", "第三部分：创造与边界", "AI能否创造真正的新事物"),
    ("20260209-AI生成内容时代：原创性、作者身份与创作价值的再定义.md", "chap_09.html", "", "AI生成内容时代：原创性、作者身份与创作价值的再定义"),
    ("20260225-生成式AI的概率本质与创新边界：从一个具体任务说起.md", "chap_10.html", "", "生成式AI的概率本质与创新边界：从一个具体任务说起"),
    ("20260328-从自建-Agent-到-Agent-Runtime-Skill：AI-系统架构的演进与收敛.md", "chap_11.html", "第四部分：架构与商业", "从自建Agent到Agent Runtime + Skill：AI系统架构的演进与收敛"),
    ("20260226-将执行路径固化为资产：一种面向长期运行的-AI-架构.md", "chap_12.html", "", "将执行路径固化为资产：一种面向长期运行的AI架构"),
    ("20260308-大模型时代，中小公司如何寻找-AI-竞争空间.md", "chap_13.html", "", "大模型时代：中小公司如何寻找AI竞争空间"),
    ("20260331-从-Skill-化到控制权：AI-系统中的能力分层与资产保护.md", "chap_14.html", "", "从Skill化到控制权：AI系统中的能力分层与资产保护"),
]

# 删除模式
DELETE_PATTERNS = [
    # Frontmatter
    re.compile(r'^---\n.*?\n---\n', re.DOTALL),
    # AI 辅助说明
    re.compile(r'\n\n>>\s*以下[由为]?\w+[A-Za-z]*\s*[生成整理]*.*?(?=\n\n|\n#|\n##|\n---)', re.DOTALL),
    re.compile(r'>>\s*AI\s*--.*?(?=\n\n|\n#|\n##|\n---)', re.DOTALL),
    # AI 评注段落（识别 AI 对话评注的特征性开头）
    re.compile(r'\n\n##\s*扩展\n.*', re.DOTALL),
    re.compile(r'\n\n>>\s*来自.*?\n\n.*', re.DOTALL),
    # Reference 区块
    re.compile(r'\n\n#\s*Reference\n.*', re.DOTALL),
    re.compile(r'\n##\s*附录\n.*', re.DOTALL),
    # 空的或无内容的区块清理
    re.compile(r'\n\n\s*\*\s*\[.*?\]\(http.*?\)\n'),
]

def clean_content(md_content: str) -> str:
    for pattern in DELETE_PATTERNS:
        md_content = pattern.sub('', md_content)
    return md_content.strip()

def md_to_html_fragment(md_content: str, title: str) -> str:
    """用 pandoc 将 markdown 片段转为 HTML"""
    import subprocess
    result = subprocess.run(
        ['pandoc', '-f', 'markdown', '-t', 'html',
         '--wrap=none', '--no-highlight'],
        input=md_content,
        capture_output=True, text=True, encoding='utf-8'
    )
    body_html = result.stdout.strip()
    return f'<div class="chapter">\n<h1 class="chapter-title">{title}</h1>\n{body_html}\n</div>\n'

# 用 pandoc 转换整篇 markdown（保留标题结构）
def full_md_to_html(md_content: str, title: str) -> str:
    import subprocess
    result = subprocess.run(
        ['pandoc', '-f', 'markdown-auto_identifiers', '-t', 'html',
         '--wrap=none', '--no-highlight'],
        input=md_content,
        capture_output=True, text=True, encoding='utf-8'
    )
    return result.stdout.strip()

out_dir = os.path.join(os.path.dirname(__file__), 'content')
os.makedirs(out_dir, exist_ok=True)

for filename, out_name, part_title, chapter_title in articles:
    filepath = os.path.join(POSTS_DIR, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        raw = f.read()

    cleaned = clean_content(raw)
    html = full_md_to_html(cleaned, chapter_title)

    out_path = os.path.join(out_dir, out_name)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"✓ {out_name}")
```

运行:
```bash
cd /Users/kingsonwu/programming/kingson4wu/kingson4wu.github.io.zh/content
python3 clean_articles.py
```

- [ ] 创建 `content/clean_articles.py`
- [ ] 运行脚本验证 14 个 `chap_*.html` 文件全部生成

---

## Task 3: 生成前言

**文件：**
- 创建: `templates/foreword.html`

前言约 300 字，说明本书目的与四部分结构逻辑。

内容由 AI 辅助整理核心论点：

- 第一部分「理解 AI」：建立对 AI 本质与认知模式的认知基础
- 第二部分「人机关系」：探讨 AI 对工作、社会关系的影响与应对
- 第三部分「创造与边界」：厘清 AI 创造力的边界与原创性重新定义
- 第四部分「架构与商业」：从系统构建到商业落地的实践路径

- [ ] 人工撰写前言内容，保存到 `templates/foreword.html`

---

## Task 4: 生成封面 HTML

**文件：**
- 创建: `templates/cover.html`

A4 居中布局，黑体 28pt 标题，副标题含作者和日期。

- [ ] 创建 `templates/cover.html`

---

## Task 5: 生成目录 HTML

**文件：**
- 创建: `templates/toc.html`

手动编写四部分 + 14 章的编号目录，含页码占位。

- [ ] 创建 `templates/toc.html`

---

## Task 6: 生成后记

**文件：**
- 创建: `templates/afterword.html`

约 200 字，收敛全册核心观点：

- AI 是"规律发现系统"而非类人智能
- 人机协作的核心是人类承担策略层、AI 承担执行层
- AI 的创造力边界在于 L1 优化层，L2-L4 需要人类参与
- Skill 是 AI 时代最有价值的长期数字资产

- [ ] 人工撰写后记内容，保存到 `templates/afterword.html`

---

## Task 7: 拼接完整 HTML + CSS

**文件：**
- 创建: `templates/book.css`
- 创建: `templates/build_book.py`
- 输出: `output/ai-essay-book.html`

**book.css 要点：**
```css
@page {
  size: A4;
  margin: 2.5cm 3cm;
  @bottom-right {
    content: "Kingson's AI Notes · 2026";
    font-style: italic;
    font-size: 9pt;
    color: #cccccc;
  }
}

/* 水印通过 CSS 实现：斜体灰字叠压在右下角 */
@page {
  background: transparent;
}

/* 封面 */
.cover { page-break-after: always; text-align: center; padding-top: 6cm; }

/* 目录 */
.toc { page-break-after: always; }

/* 每章 */
.chapter { page-break-before: auto; }
.chapter-title { font-size: 16pt; font-weight: bold; margin-bottom: 1.5em; }

/* 正文 */
body { font-family: "Songti SC", "SimSun", serif; font-size: 11pt; line-height: 1.8; }

/* 引用块 */
blockquote {
  margin: 1em 2em;
  padding: 0.5em 1em;
  background: #f5f5f5;
  font-size: 10.5pt;
  border-left: 3px solid #999;
}

/* 代码块 */
pre, code {
  font-family: "Menlo", "Courier New", monospace;
  font-size: 10pt;
  background: #f5f5f5;
}
pre { padding: 0.8em 1em; overflow-x: auto; }

/* 表格 */
table { border-collapse: collapse; width: 100%; font-size: 10pt; }
th, td { border: 1px solid #ccc; padding: 0.4em 0.6em; }
th { background: #f0f0f0; }

/* 列表 */
ul, ol { margin: 0.8em 0; }
li { margin-bottom: 0.3em; }
```

**build_book.py** 按顺序拼接所有片段为一个完整的 HTML 文件。

运行:
```bash
python3 templates/build_book.py
```

- [ ] 创建 `templates/book.css`
- [ ] 创建 `templates/build_book.py`
- [ ] 运行脚本生成 `output/ai-essay-book.html`
- [ ] 验证 HTML 文件存在且大小 > 50KB

---

## Task 8: weasyprint 渲染 PDF

**文件：**
- 运行: `weasyprint output/ai-essay-book.html output/AI思考小册子-2026.pdf`

运行:
```bash
cd /Users/kingsonwu/programming/kingson4wu/kingson4wu.github.io.zh
weasyprint output/ai-essay-book.html output/AI思考小册子-2026.pdf 2>&1
ls -lh output/AI思考小册子-2026.pdf
```

- [ ] 生成 PDF 文件
- [ ] 确认文件大小 > 500KB

---

## Task 9: 验证输出

- [ ] 用预览打开 PDF 确认封面、目录、正文、水印正常
- [ ] 如有分页问题，调整 CSS 后重新 weasyprint
