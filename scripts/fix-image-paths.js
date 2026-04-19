'use strict';

const fs = require('hexo-fs');
const { join, extname } = require('path');

/**
 * Fix for permalink_pinyin + post_asset_folder:
 *
 * When post_asset_folder is enabled, the marked renderer resolves image paths
 * using Post.path (which permalink_pinyin converts to pinyin). But the asset
 * folder on disk uses the original Chinese folder name (derived from the md
 * filename, with different punctuation). This filter copies assets from the
 * Chinese-named source folder to the pinyin public URL path after generation.
 */
hexo.extend.filter.register('after_generate', async function () {
  const Post = this.model('Post');
  const publicDir = this.public_dir;
  const sourcePostsDir = join(this.base_dir, 'source', '_posts');

  const posts = Post.toArray();

  for (const post of posts) {
    if (!post.source.startsWith('source/_posts/') && !post.source.startsWith('_posts/')) continue;
    const postPinyinPath = post.path.replace(/\.html?$/, '').replace(/\/$/, '');

    const chineseFolderMd = post.source.replace(/^source\/_posts\//, '').replace(/^_posts\//, '').replace(/\.md$/, '');
    const chineseFolder = chineseFolderMd.replace(/：/, '-');
    const chineseAssetDir = join(sourcePostsDir, chineseFolder);
    const targetDir = join(publicDir, postPinyinPath);

    if (!fs.existsSync(chineseAssetDir)) continue;

    const allFiles = fs.listDirSync(chineseAssetDir);
    const files = allFiles.filter(f => {
      const ext = extname(f).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext);
    });

    for (const file of files) {
      const srcPath = join(chineseAssetDir, file);
      const dstPath = join(targetDir, file);

      if (fs.existsSync(srcPath) && !fs.existsSync(dstPath)) {
        await fs.copyFile(srcPath, dstPath);
      }
    }
  }
});
