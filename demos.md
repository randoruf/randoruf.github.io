---
layout: page
title: Demos
permalink: /demos/
---

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