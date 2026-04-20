'use strict';

const fs = require('fs');
const { join, extname, dirname } = require('path');

/**
 * Post-process hexo generated HTML files to fix image src paths.
 * For each index.html, look for images in the same directory and fix src attributes:
 * - Missing article slug -> add slug
 * - URL-encoded Chinese -> raw Chinese filename
 */
const publicDir = join(process.cwd(), 'public');

const htmlFiles = [];

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
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

console.log(`Found ${htmlFiles.length} HTML files to process`);

for (const htmlPath of htmlFiles) {
  const dir = dirname(htmlPath);
  const dirName = dir.replace(publicDir + '/', ''); // e.g. "2020/08/31/20200831-guan-yu-mha..."

  // Get all image files in this directory
  let imageFiles;
  try {
    imageFiles = fs.readdirSync(dir).filter(f => {
      const ext = extname(f).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext);
    });
  } catch (e) {
    continue;
  }

  if (imageFiles.length === 0) continue;

  const actualFilenames = new Set(imageFiles);

  let html = fs.readFileSync(htmlPath, 'utf8');
  const originalHtml = html;

  const imgSrcPtn = /src="([^"]+\.(?:png|jpg|jpeg|gif|svg|webp))"/gi;
  html = html.replace(imgSrcPtn, (match, srcValue) => {
    // Decode to find the actual filename
    let decodedSrc;
    try {
      decodedSrc = decodeURIComponent(srcValue);
    } catch (e) {
      decodedSrc = srcValue;
    }

    const decodedFilename = decodedSrc.split('/').pop();
    if (!decodedFilename) return match;

    // Find actual filename: exact match or URL-decoded match
    let actualFilename = null;
    if (actualFilenames.has(decodedFilename)) {
      actualFilename = decodedFilename;
    } else {
      // Try URL-decode of each actual filename
      for (const file of imageFiles) {
        try {
          if (decodeURIComponent(file) === decodedFilename) {
            actualFilename = file;
            break;
          }
        } catch (e) {}
      }
    }

    if (!actualFilename) return match;

    // Does src already include the dirName (article slug path)?
    const srcHasSlug = srcValue.includes(dirName);
    let correctSrc;

    if (srcHasSlug) {
      // Replace only the filename (slug already present, but filename might be URL-encoded)
      const lastSlash = srcValue.lastIndexOf('/');
      correctSrc = srcValue.substring(0, lastSlash) + '/' + actualFilename;
    } else {
      // Add slug: /zh/ + dirName + / + filename
      // srcValue looks like "/zh/foo.png" or "/zh/2020/08/31/old-slug/foo.png"
      // We want: /zh/dirName/foo.png
      const firstSlash = srcValue.indexOf('/');
      const secondSlash = srcValue.indexOf('/', firstSlash + 1);
      const basePath = srcValue.substring(0, secondSlash);
      correctSrc = basePath + '/' + dirName + '/' + actualFilename;
    }

    if (srcValue === correctSrc) return match;
    return 'src="' + correctSrc + '"';
  });

  if (html !== originalHtml) {
    fs.writeFileSync(htmlPath, html);
    console.log(`Fixed: ${htmlPath.replace(publicDir + '/', '')}`);
  }
}

console.log('Done');
