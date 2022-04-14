---
layout: page
title: Archives
permalink: /archives/
---

这里以后只记录想法。

技术细节最好要有代码实例，可以放到 `cs-nano-projects` 里面。 


<h2>>>>> Also in <a href="/tag/">Tag</a></h2>

<p>Since 2019 to <script>document.write(new Date().getFullYear());</script> </p>
<ul>
  {% for post in site.posts %}

    {% unless post.next %}
      <h3>{{ post.date | date: '%Y' }}</h3>
    {% else %}
      {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
      {% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
      {% if year != nyear %}
        <h3>{{ post.date | date: '%Y' }}</h3>
      {% endif %}
    {% endunless %}
    
    <li>{{ post.date | date:"%b %d" }}-<a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>