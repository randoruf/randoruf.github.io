---
layout: post
title: "双缓存的原理"
date: 2021-01-19T00:20:00Z
tags: [computer_graphics]
---

**Double Buffer** 

- 第一种是 Offscreen Buffer 画图，然后复制到屏幕(复制到 Screen Buffer)。 所以有两个 Buffers
- 第二种。显然复制会很浪费时间，为什么不用三个 Buffer 呢？

[【硬件科普】全网最详细易懂的G-sync Freesync 垂直同步工作原理科普 - YouTube](https://www.youtube.com/watch?v=dnsPyyaNCWc)

看这个视频就可以了。不用看别的。