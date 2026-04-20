'use strict';

const fs = require('fs');
const { join, extname, dirname } = require('path');

/**
 * Post-process hexo generated HTML files to fix image src paths.
 * - Article index.html: images in same dir → add article slug if missing
 * - Home page (index.html): find which article dir contains each image → use that slug
 * - URL-encoded Chinese → raw Chinese filename
 */
const publicDir = join(process.cwd(), 'public');

// Phase 1: build a map of all image files to their article slug
const imageToArticleSlug = new Map(); // filename → article slug (e.g. "2020/08/31/...slug...")

function scanForImages(dir, currentSlug) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Determine article slug: if this dir has an index.html, it's an article dir
      // Otherwise, propagate current slug
      let entries2;
      try {
        entries2 = fs.readdirSync(fullPath);
      } catch (e) {
        continue;
      }
      const hasIndex = entries2.includes('index.html');
      const newSlug = hasIndex ? fullPath.replace(publicDir + '/', '') : currentSlug;
      scanForImages(fullPath, newSlug);
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
        imageToArticleSlug.set(entry.name, currentSlug);
      }
    }
  }
}

scanForImages(publicDir, '');

// Debug: check some images
const checkImages = ['anthropic-skill-unified.png', 'MHA_Consul_MySQL切换.png', 'avatar.png'];
for (const img of checkImages) {
  console.log(`${img} -> ${imageToArticleSlug.get(img) || 'NOT FOUND'}`);
}

// Phase 2: process all HTML files
const htmlFiles = [];

function walkDir(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return;
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name === 'index.html') {
      htmlFiles.push(fullPath);
    }
  }
}

walkDir(publicDir);

console.log(`\nProcessing ${htmlFiles.length} HTML files`);

let fixCount = 0;
for (const htmlPath of htmlFiles) {
  const dir = dirname(htmlPath);
  const dirName = dir.replace(publicDir + '/', '');

  let html = fs.readFileSync(htmlPath, 'utf8');
  const originalHtml = html;

  const imgSrcPtn = /src="([^"]+\.(?:png|jpg|jpeg|gif|svg|webp))"/gi;

  html = html.replace(imgSrcPtn, (match, srcValue) => {
    let decodedSrc;
    try {
      decodedSrc = decodeURIComponent(srcValue);
    } catch (e) {
      decodedSrc = srcValue;
    }

    const decodedFilename = decodedSrc.split('/').pop();
    if (!decodedFilename) return match;

    // Find article slug for this image
    const articleSlug = imageToArticleSlug.get(decodedFilename);
    if (!articleSlug) return match; // external or uploads, leave unchanged

    // Is src already correct?
    if (srcValue.includes(articleSlug)) {
      return match; // already has slug
    }

    // Build correct src: / + articleSlug + / + filename
    const correctSrc = '/' + articleSlug + '/' + decodedFilename;
    if (srcValue === correctSrc) return match;

    fixCount++;
    return 'src="' + correctSrc + '"';
  });

  if (html !== originalHtml) {
    fs.writeFileSync(htmlPath, html);
    console.log(`Fixed: ${htmlPath.replace(publicDir + '/', '')}`);
  }
}

console.log(`Total fixes: ${fixCount}`);
console.log('Done');
