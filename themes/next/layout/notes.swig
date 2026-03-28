{% extends '_layout.swig' %}
{% import '_macro/post.swig' as post_template %}
{% import '_macro/sidebar.swig' as sidebar_template %}

{% block title %}{{ page.title }} | {{ config.title }}{% endblock %}

{% block page_class %}page-notes{% endblock %}

{% block content %}
  <section id="posts" class="posts-expand">
    {% if page.posts.length %}
      {% for post in page.posts %}
        {{ post_template.render(post, true, 'post-note') }}
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
