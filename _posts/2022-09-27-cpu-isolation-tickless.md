---
layout: post
title: 'CPU isolation & tickless'
date: 2022-09-27
tags: [linux]
---

* TOC 
{:toc}

---

## Check Interrupts 

```
sudo less /proc/interrupts
```

理想情况下，被隔离的 CPU 应该全部都是 0 的。


## 
