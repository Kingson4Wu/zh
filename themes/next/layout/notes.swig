{% extends '_layout.swig' %}
{% import '_macro/sidebar.swig' as sidebar_template %}

{% block title %}{{ page.title }} | {{ config.title }}{% endblock %}

{% block page_class %}page-notes{% endblock %}

{% block content %}
  <style>
    .notes-feed {
      padding-top: 10px;
    }

    .notes-feed-title {
      margin: 0 0 28px;
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #999;
    }

    .note-entry {
      margin-bottom: 40px;
      padding-bottom: 32px;
      border-bottom: 1px solid #ececec;
    }

    .note-entry:last-child {
      border-bottom: 0;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .note-meta {
      margin-bottom: 10px;
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #999;
    }

    .note-title {
      margin: 0 0 14px;
      font-size: 24px;
      font-weight: 600;
      line-height: 1.45;
    }

    .note-title a {
      color: inherit;
      border-bottom: 0;
    }

    .note-title a:hover {
      color: #555;
    }

    .note-body {
      color: #444;
      font-size: 16px;
      line-height: 1.9;
    }

    .note-body p,
    .note-body ul,
    .note-body ol,
    .note-body blockquote,
    .note-body pre,
    .note-body figure,
    .note-body table {
      margin-bottom: 1em;
    }

    .note-body > :last-child {
      margin-bottom: 0;
    }

    .note-link {
      display: inline-block;
      margin-top: 14px;
      font-size: 13px;
      color: #777;
      border-bottom: 0;
    }

    .note-link:hover {
      color: #222;
    }
  </style>

  <section id="posts" class="notes-feed">
    <p class="notes-feed-title">Notes</p>
    {% if page.posts.length %}
      {% for post in page.posts %}
        <article class="note-entry" itemscope itemtype="http://schema.org/Article">
          <div class="note-meta">
            <time itemprop="dateCreated datePublished" datetime="{{ moment(post.date).format() }}">
              {{ date(post.date, config.date_format) }}
            </time>
          </div>

          {% if post.title %}
            <h2 class="note-title" itemprop="name headline">
              <a href="{{ url_for(post.path) }}" itemprop="url">{{ post.title }}</a>
            </h2>
          {% endif %}

          <div class="note-body{% if theme.han %} han-init-context{% endif %}" itemprop="articleBody">
            {{ post.content }}
          </div>

          <a class="note-link" href="{{ url_for(post.path) }}">Permalink</a>
        </article>
      {% endfor %}
    {% else %}
      <div class="post-block page">
        <div class="post-body">
          <p>还没有 Notes。</p>
        </div>
      </div>
    {% endif %}
  </section>
{% endblock %}

{% block sidebar %}
  {{ sidebar_template.render(false) }}
{% endblock %}
