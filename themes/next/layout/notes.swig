{% extends '_layout.swig' %}
{% import '_macro/sidebar.swig' as sidebar_template %}

{% block title %}{{ page.title }} | {{ config.title }}{% endblock %}

{% block page_class %}page-notes{% endblock %}

{% block content %}
  <style>
    .page-notes .content-wrap {
      background: transparent;
      box-shadow: none;
      border-radius: 0;
    }

    .page-notes #content {
      padding-top: 6px;
    }

    .notes-feed {
      padding-top: 6px;
    }

    .notes-feed-title {
      margin: 0 0 32px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #9a948c;
    }

    .note-entry {
      margin-bottom: 46px;
      padding-bottom: 38px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.07);
    }

    .note-entry:last-child {
      border-bottom: 0;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .note-meta {
      margin-bottom: 12px;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #a39b92;
    }

    .note-title {
      margin: 0 0 16px;
      font-size: 29px;
      font-weight: 500;
      line-height: 1.38;
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
      color: #3f3a36;
      font-size: 17px;
      line-height: 2.0;
      letter-spacing: 0.01em;
      word-break: break-word;
    }

    .note-body p,
    .note-body ul,
    .note-body ol,
    .note-body blockquote,
    .note-body pre,
    .note-body figure,
    .note-body table {
      margin-bottom: 1.15em;
    }

    .note-body h2,
    .note-body h3,
    .note-body h4 {
      margin: 1.8em 0 0.8em;
      font-weight: 600;
      line-height: 1.55;
      color: #2f2a26;
    }

    .note-body h2 {
      font-size: 1.18em;
    }

    .note-body h3 {
      font-size: 1.08em;
    }

    .note-body ul,
    .note-body ol {
      padding-left: 1.4em;
    }

    .note-body li {
      margin-bottom: 0.45em;
    }

    .note-body blockquote {
      margin: 1.4em 0;
      padding: 0.2em 0 0.2em 1.1em;
      border-left: 2px solid #d7d1c8;
      color: #6f675f;
      background: transparent;
    }

    .note-body pre,
    .note-body figure.highlight {
      margin: 1.3em 0;
      border-radius: 6px;
      overflow: hidden;
    }

    .note-body code {
      font-size: 0.92em;
    }

    .note-body > :last-child {
      margin-bottom: 0;
    }

    .note-link {
      display: inline-block;
      margin-top: 18px;
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #8b847c;
      border-bottom: 0;
    }

    .note-link:hover {
      color: #2f2a26;
    }

    @media (max-width: 767px) {
      .note-title {
        font-size: 24px;
      }

      .note-body {
        font-size: 16px;
        line-height: 1.9;
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

          <a class="note-link" href="{{ url_for(post.path) }}">单篇链接</a>
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
  {{ sidebar_template.render(false) }}
{% endblock %}
