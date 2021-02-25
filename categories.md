---
layout: page
title: Categories
permalink: /categories/
---

<div id="archives">
       <h1>Mathematics</h1>
       {% for page in site.pages  %}
              {% for category in page.categories %}
                     {% if category == "math" %}
                            <li><span>{{ page.date | date_to_string }}</span> &nbsp; <a href="{{ page.url }}">{{ page.title }}</a></li>
                     {% endif %}
              {% endfor %}
       {% endfor %}
</div>

