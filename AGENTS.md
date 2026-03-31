# Repository Guidelines

## Project Structure & Module Organization

This repository is the Chinese Hexo blog source for `https://kingson4wu.github.io/zh/`. Main content lives in `source/_posts/`; post assets are stored beside posts because `post_asset_folder: true` is enabled. Shared uploads such as avatars and icons live under `source/uploads/`. Theme customizations are in `themes/next/`, while site-level behavior changes, such as the notes index and pagination filtering, live in `scripts/notes.js`. Generated output goes to `public/`; treat `public/` and `.deploy_git/` as build artifacts, not hand-edited source.

## Build, Test, and Development Commands

Run all commands from the repository root:

- `npm install`: install Hexo and theme dependencies.
- `npx hexo clean`: remove generated files before a fresh build.
- `npx hexo server`: start the local server.
- `npx hexo generate`: build the static site into `public/`.
- `./preview.sh`: shorthand for `hexo s -g` to generate and preview locally.
- `./publish.sh`: shorthand for `hexo d -g` to generate and deploy via Hexo.

For most content changes, the standard validation flow is `npx hexo clean && npx hexo generate`.

## Coding Style & Naming Conventions

Preserve existing YAML and Markdown style in posts and config files. Use clear Chinese titles in frontmatter and keep post filenames date-prefixed, for example `20260329-标题.md`. Notes should be regular posts with `categories: [notes]`, because the custom notes page depends on category-based aggregation. For scripts and theme edits, match the surrounding style and avoid unrelated formatting churn.

## Testing Guidelines

There is no dedicated repository-wide test suite for site content. Treat successful `npx hexo generate` as the primary quality gate. When changing custom scripts, theme templates, or pagination behavior, also preview locally with `./preview.sh` and confirm that `/notes/`, archives, and the home page render correctly. Theme-internal tests exist under `themes/next/test/`, but they are secondary to validating the built site.

## Commit & Pull Request Guidelines

Recent commits follow concise conventional subjects such as `fix: ...`, `style: ...`, and `docs(notes): ...`. Keep subjects imperative and scoped to the dominant change. PRs should summarize user-visible impact, list changed paths such as `source/_posts/...` or `scripts/notes.js`, and include screenshots only for layout or theme changes. Mention deployment impact when changes affect generation, routing, or `gh-pages`.
