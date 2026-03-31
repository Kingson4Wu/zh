# Spec: Adapting 3 Chinese Posts to English Site

## Context

The user wants to repurpose three Chinese blog posts from `kingson4wu.github.io.zh` (Hexo) and publish adapted English versions on `kingson4wu.github.io.en` (Astro).

The English site uses Astro with blog posts in `src/content/blog/` and notes in `src/content/notes/`. Existing English posts have a natural first-person, direct, reflective voice.

## Decisions Made

- **Content type**: All three are blog posts (not notes)
- **Workflow**: One by one with review between each — adapt, review, publish, then next
- **Approach**: Translation-adaptation (ideas travel, prose is re-drafted to match natural English voice), not literal translation
- **Titles**: Retitled in English, not literally translated

## Article Order

1. Article 1 first (most philosophical, least jargon-heavy — calibration piece)
2. Article 2 second (AI systems architecture, more technical vocabulary)
3. Article 3 third (economic essay)

## Article-by-Article Plan

### Article 1: 直觉先行，解释在后

- **Chinese title**: 人类与模型的共同特征：直觉先行，解释在后
- **English title**: Intuition First, Explanation After: What Humans and LLMs Have in Common
- **Slug**: `intuition-first-explanation-after`
- **Source**: `source/_posts/20260204-人类与模型的共同特征：直觉先行，解释在后.md`
- **Target**: `src/content/blog/intuition-first-explanation-after.md`
- **Sections to adapt**: 7 original sections → condense into cohesive English essay
- **Voice note**: First-person, reflective, philosophical. Avoid stiff academic phrasing.

### Article 2: 从自建 Agent 到 Agent Runtime + Skill

- **Chinese title**: 从自建 Agent 到 Agent Runtime + Skill：AI 系统架构的演进与收敛
- **English title** (draft): From Custom Agents to Agent Runtime + Skill: Convergence in AI System Architecture
- **Slug** (draft): `agent-runtime-and-skill-convergence`
- **Source**: `source/_posts/20260328-从自建-Agent-到-Agent-Runtime-Skill：AI-系统架构的演进与收敛.md`
- **Target**: `src/content/blog/agent-runtime-and-skill-convergence.md`
- **Sections to adapt**: 8 original sections with ASCII diagrams → adapt diagrams and preserve structure
- **Voice note**: Systems thinking, analytical, direct. Technical but accessible.

### Article 3: 技术进步与分配失衡

- **Chinese title**: 技术进步与分配失衡：AI时代的结构性矛盾
- **English title** (draft): Technology Advances, Distribution Lags: The Structural Contradiction of the AI Era
- **Slug** (draft): `ai-structural-distribution-imbalance`
- **Source**: `source/_posts/20260331-技术进步与分配失衡：AI时代的结构性矛盾.md`
- **Target**: `src/content/blog/ai-structural-distribution-imbalance.md`
- **Sections to adapt**: 6 original sections → maintain essay arc
- **Voice note**: Analytic, slightly uncomfortable with the status quo, non-deterministic conclusion. Avoid techno-optimist and techno-pessimist clichés.

## Common Format (Astro Frontmatter)

```yaml
---
title: '<English title>'
description: '<1-2 sentence description for SEO/listing>'
pubDate: '<ISO date of publication>'
updatedDate: '<ISO date of adaptation>'
tags:
  - <relevant tags>
---
```

## Process Per Article

1. Draft adaptation in a scratch file
2. Show draft to user via Telegram reply
3. User reviews and approves (or requests changes)
4. On approval: write to target path in `kingson4wu.github.io.en`
5. Build and verify Astro site compiles cleanly (`astro build`)
6. User publishes manually

## What This Spec Does NOT Cover

- Any changes to the Chinese source site
- Scheduling or promotion of published posts
- Translation of any other content
