'use strict';

function isNotesPost(post) {
  if (!post || !post.categories || !post.categories.length) return false;
  return post.categories.some(category => category.name === 'notes');
}

function excludeNotes(posts) {
  if (!posts) return [];
  if (typeof posts.filter === 'function') {
    return posts.filter(post => !isNotesPost(post));
  }
  return [];
}

hexo.extend.helper.register('is_notes_post', isNotesPost);
hexo.extend.helper.register('exclude_notes', excludeNotes);

hexo.extend.generator.register('notes', function(locals) {
  const root = hexo.config.root || '/';
  const normalizedRoot = root.endsWith('/') ? root : root + '/';
  const notesPosts = locals.posts.filter(post => isNotesPost(post)).sort('-date');

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
