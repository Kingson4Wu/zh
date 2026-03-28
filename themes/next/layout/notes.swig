{% extends '_layout.swig' %}

{% block title %}{{ page.title }} | {{ config.title }}{% endblock %}

{% block page_class %}page-notes{% endblock %}

{% block content %}
  <style>
    .page-notes .header {
      width: auto;
      max-width: 760px;
      margin: 0 auto;
    }

    .page-notes .header-inner {
      position: relative;
      width: 100%;
      padding: 22px 18px 0;
      background: transparent;
      box-shadow: none;
      border-radius: 0;
    }

    .page-notes .site-meta {
      padding: 0 0 8px;
      color: inherit;
      background: transparent;
      box-shadow: none;
    }

    .page-notes .brand,
    .page-notes .brand:hover {
      color: #2f2a26;
    }

    .page-notes .site-title {
      font-size: 24px;
      letter-spacing: 0;
    }

    .page-notes .site-subtitle {
      margin: 6px 0 0;
      color: #8f8881;
      font-size: 12px;
    }

    .page-notes .site-nav {
      display: block !important;
      margin-top: 10px;
      border-top: 0;
    }

    .page-notes .menu {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 18px;
      margin-top: 0;
      text-align: left;
    }

    .page-notes .menu .menu-item {
      display: inline-block;
      margin: 0;
    }

    .page-notes .menu .menu-item a {
      padding: 0;
      font-size: 12px;
      color: #6e675f;
      text-align: left;
      background: transparent;
      border-bottom: 0;
    }

    .page-notes .menu .menu-item a:hover {
      color: #2f2a26;
      background: transparent;
    }

    .page-notes .menu-item-active a:after {
      display: none;
    }

    .page-notes .main-inner {
      width: auto;
    }

    .page-notes .content-wrap {
      float: none;
      width: 100%;
      max-width: 760px;
      min-height: auto;
      margin: 0 auto;
      padding: 28px 18px 12px;
      background: transparent;
      box-shadow: none;
      border-radius: 0;
    }

    .page-notes .sidebar {
      display: none;
    }

    .page-notes .footer-inner {
      width: auto;
      padding-left: 0;
      padding-right: 0;
    }

    .page-notes #content {
      padding-top: 6px;
    }

    .notes-feed {
      padding-top: 6px;
    }

    .notes-feed-title {
      margin: 0 0 26px;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #a7a19a;
    }

    .note-entry {
      margin-bottom: 34px;
      padding-bottom: 28px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .note-entry:last-child {
      border-bottom: 0;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .note-meta {
      margin-bottom: 8px;
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #b1aaa2;
    }

    .note-title {
      margin: 0 0 12px;
      font-size: 20px;
      font-weight: 520;
      line-height: 1.34;
      letter-spacing: 0.01em;
    }

    .note-title a {
      color: inherit;
      border-bottom: 0;
    }

    .note-title a:hover {
      color: #555;
    }

    .note-body {
      color: #514a44;
      font-size: 15px;
      line-height: 1.82;
      letter-spacing: 0;
      word-break: break-word;
    }

    .note-body p,
    .note-body ul,
    .note-body ol,
    .note-body blockquote,
    .note-body pre,
    .note-body figure,
    .note-body table {
      margin-bottom: 0.9em;
    }

    .note-body h2,
    .note-body h3,
    .note-body h4 {
      margin: 1.45em 0 0.6em;
      font-weight: 600;
      line-height: 1.45;
      color: #35302c;
    }

    .note-body h2 {
      font-size: 1.08em;
    }

    .note-body h3 {
      font-size: 1em;
    }

    .note-body ul,
    .note-body ol {
      padding-left: 1.2em;
    }

    .note-body li {
      margin-bottom: 0.28em;
    }

    .note-body blockquote {
      margin: 1em 0;
      padding: 0.1em 0 0.1em 0.9em;
      border-left: 2px solid #ddd7cf;
      color: #746d66;
      background: transparent;
    }

    .note-body pre,
    .note-body figure.highlight {
      margin: 1em 0;
      border-radius: 4px;
      overflow: hidden;
    }

    .note-body code {
      font-size: 0.88em;
    }

    .note-body > :last-child {
      margin-bottom: 0;
    }

    .note-link {
      display: inline-block;
      margin-top: 12px;
      font-size: 12px;
      letter-spacing: 0.02em;
      color: #8f8881;
      border-bottom: 0;
    }

    .note-link:hover {
      color: #35302c;
    }

    @media (max-width: 767px) {
      .page-notes .header-inner {
        padding: 16px 0 0;
      }

      .page-notes .site-title {
        font-size: 20px;
      }

      .page-notes .content-wrap {
        padding: 18px 0 8px;
      }

      .note-title {
        font-size: 18px;
      }

      .note-body {
        font-size: 14px;
        line-height: 1.78;
      }
    }
  </style>

  <section id="posts" class="notes-feed">
    <p class="notes-feed-title">随记</p>
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

          <a class="note-link" href="{{ url_for(post.path) }}">查看原文</a>
        </article>
      {% endfor %}
    {% else %}
      <div class="post-block page">
        <div class="post-body">
          <p>还没有随记。</p>
        </div>
      </div>
    {% endif %}
  </section>
{% endblock %}

{% block sidebar %}
{% endblock %}
