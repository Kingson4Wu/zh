'use strict';

const pagination = require('hexo-pagination');
const { sort } = require('timsort');

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

function visiblePostCount(posts) {
  return excludeNotes(posts).length || 0;
}

hexo.extend.helper.register('is_notes_post', isNotesPost);
hexo.extend.helper.register('exclude_notes', excludeNotes);
hexo.extend.helper.register('visible_post_count', visiblePostCount);

hexo.extend.generator.register('index', function(locals) {
  const config = this.config;
  const posts = excludeNotes(locals.posts).sort(config.index_generator.order_by);

  sort(posts.data, (a, b) => (b.sticky || 0) - (a.sticky || 0));

  const paginationDir = config.pagination_dir || 'page';
  const path = config.index_generator.path || '';

  return pagination(path, posts, {
    perPage: config.index_generator.per_page,
    layout: ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });
});

hexo.extend.generator.register('archive', function(locals) {
  const config = this.config;
  let archiveDir = config.archive_dir;
  const paginationDir = config.pagination_dir || 'page';
  const allPosts = excludeNotes(locals.posts).sort(config.archive_generator.order_by || '-date');
  const perPage = config.archive_generator.per_page;
  let result = [];

  if (!allPosts.length) return;
  if (archiveDir[archiveDir.length - 1] !== '/') archiveDir += '/';

  function generate(path, posts, options) {
    options = options || {};
    options.archive = true;

    result = result.concat(pagination(path, posts, {
      perPage: perPage,
      layout: ['archive', 'index'],
      format: paginationDir + '/%d/',
      data: options
    }));
  }

  generate(archiveDir, allPosts);

  if (!config.archive_generator.yearly) return result;

  const postsByYear = {};

  allPosts.forEach(post => {
    const date = post.date;
    const year = date.year();
    const month = date.month() + 1;

    if (!Object.prototype.hasOwnProperty.call(postsByYear, year)) {
      postsByYear[year] = [[], [], [], [], [], [], [], [], [], [], [], [], []];
    }

    postsByYear[year][0].push(post);
    postsByYear[year][month].push(post);

    if (config.archive_generator.daily) {
      const day = date.date();
      if (!Object.prototype.hasOwnProperty.call(postsByYear[year][month], 'day')) {
        postsByYear[year][month].day = {};
      }

      (postsByYear[year][month].day[day] || (postsByYear[year][month].day[day] = [])).push(post);
    }
  });

  const Query = this.model('Post').Query;
  const years = Object.keys(postsByYear);

  for (let i = 0; i < years.length; i++) {
    const year = +years[i];
    const data = postsByYear[year];
    const url = archiveDir + year + '/';
    if (!data[0].length) continue;

    generate(url, new Query(data[0]), { year: year });

    if (!config.archive_generator.monthly && !config.archive_generator.daily) continue;

    for (let month = 1; month <= 12; month++) {
      const monthData = data[month];
      if (!monthData.length) continue;

      if (config.archive_generator.monthly) {
        generate(url + (month < 10 ? '0' + month : month) + '/', new Query(monthData), {
          year: year,
          month: month
        });
      }

      if (!config.archive_generator.daily) continue;

      for (let day = 1; day <= 31; day++) {
        const dayData = monthData.day[day];
        if (!dayData || !dayData.length) continue;
        const dayPath = url + (month < 10 ? '0' + month : month) + '/' + (day < 10 ? '0' + day : day) + '/';
        generate(dayPath, new Query(dayData), {
          year: year,
          month: month,
          day: day
        });
      }
    }
  }

  return result;
});

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
