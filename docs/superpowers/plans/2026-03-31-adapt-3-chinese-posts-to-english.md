# Adapt 3 Chinese Posts to English Site — Implementation Plan

> **For agentic workers:** This is a content writing task, not a code task. Steps are writing tasks, not code/test cycles. No testing framework applies.

**Goal:** Adapt three Chinese blog posts into natural English prose and publish them to `kingson4wu.github.io.en` (Astro site), one at a time with review between each.

**Architecture:** Each article is adapted independently. Adaptation follows "translation-adaptation" (ideas preserved, prose re-drafted for natural English voice matching existing English posts). Once approved, written to Astro content collection and built.

**Tech Stack:** Astro (English site), Telegram (for review communication), Claude (for drafting)

---

## Article 1: Intuition First, Explanation After

**Source:** `kingson4wu.github.io.zh/source/_posts/20260204-人类与模型的共同特征：直觉先行，解释在后.md`
**Target:** `kingson4wu.github.io.en/src/content/blog/intuition-first-explanation-after.md`

### Task 1: Draft Article 1 Adaptation

- [ ] **Step 1: Read source article**

Read the full Chinese source to internalize structure, arguments, tone.

- [ ] **Step 2: Draft English adaptation**

Write a complete English blog post adapting the 7 original sections:
1. Why "explanations" are unreliable
2. Intuition comes first, explanation follows
3. Rethinking what "understanding" means
4. Deep learning's foundational designs are "representation assumptions"
5. Structural similarity between model internals and human methodologies
6. The role of reflection: not replaying the process, but reinforcing intuition
7. Conclusion: understanding is structured experience in action

Preserve all key arguments. Re-draft prose to natural English voice (first-person, direct, reflective — matching existing English posts like "I used to think..." style). Use English titles for each section. Adapt examples if needed for English audience.

Draft frontmatter:
```yaml
---
title: 'Intuition First, Explanation After: What Humans and LLMs Have in Common'
description: 'A closer look at the shared tendency of humans and large language models to arrive at conclusions before generating plausible justifications — and what this means for how we understand "understanding."'
pubDate: '2026-03-31'
tags:
  - llm
  - cognition
  - AI philosophy
---
```

- [ ] **Step 2: Send draft to user for review**

Via Telegram reply to the user (chat_id from conversation context), send the complete draft as a single message (or multiple if too long). Ask for approval or feedback.

---

## Article 2: Agent Runtime + Skill Architecture

**Source:** `kingsonwu.github.io.zh/source/_posts/20260328-从自建-Agent-到-Agent-Runtime-Skill：AI-系统架构的演进与收敛.md`
**Target:** `kingson4wu.github.io.en/src/content/blog/agent-runtime-and-skill-convergence.md`

*(Tasks begin only after Article 1 is approved and published.)*

### Task 2: Draft Article 2 Adaptation

- [ ] **Step 1: Read source article**

- [ ] **Step 2: Draft English adaptation**

Write a complete English blog post adapting the 8 original sections:
1. What are we actually building?
2. From model to system: LLM as inference engine, Agent as orchestrator, Skill as structured capability
3. Two architectural paths: custom Agent vs. Agent Runtime + Skill
4. When to build custom vs. use Runtime
5. Skill Loader and the capability system
6. MCP + Skill + CLI three-layer structure
7. Coding Agent evolving into general-purpose Agent Runtime
8. Architectural convergence — three-layer view
9. Implementation path
10. Conclusion

Adapt ASCII diagrams to English-friendly format. Preserve all technical distinctions (LLM, Agent, Tool, Skill, MCP, Runtime). Use English section titles.

Draft frontmatter:
```yaml
---
title: 'From Custom Agents to Agent Runtime + Skill: Convergence in AI System Architecture'
description: 'A systems-level view of how AI applications are evolving from bespoke agent implementations toward a layered architecture of interchangeable Runtime and reusable Skills.'
pubDate: '2026-03-31'
tags:
  - llm
  - AI-agent
  - architecture
  - MCP
  - skill
---
```

- [ ] **Step 3: Send draft for review via Telegram**

---

## Article 3: Technology Progress and Distribution Imbalance

**Source:** `kingson4wu.github.io.zh/source/_posts/20260331-技术进步与分配失衡：AI时代的结构性矛盾.md`
**Target:** `kingson4wu.github.io.en/src/content/blog/ai-structural-distribution-imbalance.md`

*(Tasks begin only after Article 2 is approved and published.)*

### Task 3: Draft Article 3 Adaptation

- [ ] **Step 1: Read source article**

- [ ] **Step 2: Draft English adaptation**

Write a complete English blog post adapting the 6 original sections:
1. Why "this time is different"
2. The fracture between efficiency and distribution
3. Structural consequences
4. How the system might adjust
5. Closing reflection
6. A question worth asking

Maintain the essay arc — analytical, uncomfortable with status quo, non-deterministic conclusion. Avoid techno-optimist and techno-pessimist clichés. English section titles.

Draft frontmatter:
```yaml
---
title: 'Technology Advances, Distribution Lags: The Structural Contradiction of the AI Era'
description: 'AI is approaching zero marginal cost for cognitive labor, decoupling economic growth from employment. This is not the same story as previous industrial revolutions.'
pubDate: '2026-03-31'
tags:
  - AI
  - economics
  - structural-issues
---
```

- [ ] **Step 3: Send draft for review via Telegram**

---

## Publication Steps (run after each article is approved)

### Task P1 (after Article 1 approved): Publish Article 1

- [ ] **Step 1: Write to Astro content file**

Create `/Users/kingsonwu/programming/kingson4wu/kingson4wu.github.io.en/src/content/blog/intuition-first-explanation-after.md` with the approved draft content.

- [ ] **Step 2: Build Astro site to verify**

Run: `cd /Users/kingsonwu/programming/kingson4wu/kingson4wu.github.io.en && npm run build`
Expected: clean build, no errors

- [ ] **Step 3: Notify user**

Reply via Telegram: "Article 1 published to English site and builds cleanly. Ready to start Article 2 when you are."

### Task P2 (after Article 2 approved): Publish Article 2

- [ ] **Step 1: Write to Astro content file**
- [ ] **Step 2: Build to verify**
- [ ] **Step 3: Notify user**

### Task P3 (after Article 3 approved): Publish Article 3

- [ ] **Step 1: Write to Astro content file**
- [ ] **Step 2: Build to verify**
- [ ] **Step 3: Notify user — all three complete**

---

## Spec Self-Review

- [ ] All 3 articles have drafts and publication tasks defined
- [ ] Frontmatter format matches existing Astro posts (title, description, pubDate, tags)
- [ ] Each article waits for user approval before publishing
- [ ] No placeholder content — drafts are complete prose
- [ ] Article order preserved: 1 → 2 → 3
