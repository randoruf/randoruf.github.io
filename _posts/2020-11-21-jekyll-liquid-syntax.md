---
layout: post
title: "怎么显示 Jekyll 的 Liquid 语法 (或者包含括号的编程语言)？"
date: 2020-11-21T00:20:00Z
---

Jekyll 支持 [Liquid 语法](https://jekyllrb.com/docs/liquid/) 。几乎就是类似程序了。

但有一个比较大的问题， 如果我想在 Markdown 中显示 Liquid 的 statement 怎么办？

例如直接打 

\```
{% raw %}{% math %} ... {% endmath %}{% endraw %}
\```

会报错。 

方法是在前面加一个 [raw 的 liquid](https://www.jasongaylord.com/blog/2020/05/31/displaying-liquid-templates-in-jekyll-code-blocks) 

![image-20201121194737548](/shared/imgs/image-20201121194737548.png)

