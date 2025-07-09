'use strict';

const pagination = require('hexo-pagination');

module.exports = function(locals) {
  const config = this.config;
  const posts = locals.posts.sort(config.index_generator.order_by);

  posts.data = posts.data.sort(function(a, b) {
    if(a.top && b.top) { // 两篇文章都有top，top大的在前
      if(a.top == b.top)
			  return b.date - a.date; // 若top值一样，最新的文章在前面
      else
			  return b.top - a.top; // top大的在前面
    }
    else if(a.top && !b.top) { // 以下是只有一篇文章top有定义，那么将有top的排在前面
      return -1;
    }
    else if(!a.top && b.top) {
      return 1;
    }
    else {
      return b.date - a.date;	// 都没有top标签，最新的文章在前面
    }
  });

  posts.data.sort((a, b) => (b.sticky || 0) - (a.sticky || 0));

  const paginationDir = config.index_generator.pagination_dir || config.pagination_dir || 'page';
  const path = config.index_generator.path || '';

  return pagination(path, posts, {
    perPage: config.index_generator.per_page,
    layout: config.index_generator.layout || ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });
};
