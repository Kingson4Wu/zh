# Kingson Wu 技术博客中文站

这是中文 Hexo 博客源码仓库，站点地址为 `https://kingson4wu.github.io/zh/`。

## 本地开发

```bash
npm install
npx hexo clean
npx hexo server
```

## 构建

```bash
npx hexo clean
npx hexo generate
```

## 部署

推送到 `main` 分支后，触发 GitHub Actions → GitHub Pages（`actions/deploy-pages`）。

