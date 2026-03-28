{% if page.comments && theme.giscus.enable %}
  <script type="text/javascript">
    (function() {
      var script = document.createElement('script');
      var isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      script.src = 'https://giscus.app/client.js';
      script.setAttribute('data-repo', '{{ theme.giscus.repo }}');
      script.setAttribute('data-repo-id', '{{ theme.giscus.repo_id }}');
      script.setAttribute('data-category', '{{ theme.giscus.category }}');
      script.setAttribute('data-category-id', '{{ theme.giscus.category_id }}');
      script.setAttribute('data-mapping', '{{ theme.giscus.mapping }}');
      script.setAttribute('data-strict', '0');
      script.setAttribute('data-reactions-enabled', '{{ theme.giscus.reactions_enabled }}');
      script.setAttribute('data-emit-metadata', '0');
      script.setAttribute('data-input-position', '{{ theme.giscus.input_position }}');
      script.setAttribute('data-theme', isDark ? '{{ theme.giscus.theme_dark }}' : '{{ theme.giscus.theme_light }}');
      script.setAttribute('data-lang', '{{ theme.giscus.lang }}');
      script.setAttribute('data-loading', 'lazy');
      script.crossOrigin = 'anonymous';
      script.async = true;
      document.getElementById('giscus-container').appendChild(script);
    })();
  </script>
{% endif %}
