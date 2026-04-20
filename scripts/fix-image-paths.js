'use strict';

const fs = require('fs');
const hexoFs = require('hexo-fs');
const { join, extname } = require('path');

/**
 * Copy images from Chinese-named asset folder to pinyin URL path.
 * HTML src fixing is handled by post-process-images.js (run after hexo generate).
 */
hexo.extend.filter.register('after_generate', async function () {
  const Post = this.model('Post');
  const publicDir = this.public_dir;
  const sourcePostsDir = join(this.base_dir, 'source', '_posts');

  const posts = Post.toArray();

  for (const post of posts) {
    if (!post.source.startsWith('source/_posts/') && !post.source.startsWith('_posts/')) continue;
    const postPinyinPath = post.path.replace(/\.html?$/, '').replace(/\/$/, '');

    // Derive Chinese asset folder from post source
    const chineseFolderMd = post.source.replace(/^source\/_posts\//, '').replace(/^_posts\//, '').replace(/\.md$/, '');
    let chineseFolder = chineseFolderMd.replace(/：/g, '-');

    let chineseAssetDir = join(sourcePostsDir, chineseFolder);
    if (!fs.existsSync(chineseAssetDir)) {
      chineseFolder = chineseFolderMd.replace(/[：:：]/g, '-');
      chineseAssetDir = join(sourcePostsDir, chineseFolder);
      if (!fs.existsSync(chineseAssetDir)) {
        continue;
      }
    }

    const targetDir = join(publicDir, postPinyinPath);

    // List and copy image files
    let allFiles;
    try {
      allFiles = hexoFs.listDirSync(chineseAssetDir);
    } catch (e) {
      continue;
    }

    const files = allFiles.filter(f => {
      const ext = extname(f).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext);
    });

    for (const file of files) {
      const srcPath = join(chineseAssetDir, file);
      const dstPath = join(targetDir, file);
      if (fs.existsSync(srcPath) && !fs.existsSync(dstPath)) {
        await hexoFs.copyFile(srcPath, dstPath);
      }
    }
  }
});
