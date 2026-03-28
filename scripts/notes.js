'use strict';

hexo.extend.generator.register('notes', function(locals) {
  const root = hexo.config.root || '/';
  const normalizedRoot = root.endsWith('/') ? root : root + '/';
  const notesPosts = locals.posts.filter(post => {
    if (!post.categories || !post.categories.length) return false;
    return post.categories.some(category => category.name === 'notes');
  }).sort('-date');

  return {
    path: 'notes/index.html',
    layout: ['notes'],
    data: {
      title: 'Notes',
      type: 'notes',
      comments: false,
      permalink: `${hexo.config.url}${normalizedRoot}notes/`,
      canonical_path: `${normalizedRoot.replace(/^\//, '')}notes/index.html`,
      posts: notesPosts.toArray(),
      total: notesPosts.length
    }
  };
});
