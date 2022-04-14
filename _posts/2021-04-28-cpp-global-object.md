---
layout: post
title: "C++ 析构函数 (为什么需要避免使用全局对象 global object)"
date: 2021-04-28
tags: [cpp]
---


* TOC
{:toc}

---

这篇文章写得不错。

 [C++ 类 析构函数 - 华为云  ](https://www.huaweicloud.com/articles/6dc1676ef05edd0913f87f975ef56e13.html)



## 为什么不推荐全局变量？

不同文件之间**全局对象构造函数的执行顺序**是不确定的。

而 Stack 可以保证析构函数的执行顺序， 如果坚持用 Global Variable 会有很多奇怪的错误。

可以选择在函数用引用传参就可以了（虽然会特别啰嗦）

