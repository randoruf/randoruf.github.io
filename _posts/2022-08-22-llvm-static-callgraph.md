---
layout: post
title: 'LLVM 与 Static Callgraph 分析 (跨 Translation Unit 分析)'
date: 2022-08-22
tags: [llvm]
---

* TOC 
{:toc}

---


## 推荐资料
* <https://github.com/shamedgh/temporal-specialization/blob/master/INSTALL.md>
* <https://github.com/lihebi/LLVMCallGraph>

lihebi 的 <https://github.com/lihebi/LLVMCallGraph> 收获比较大。

在分析程序的时候，我们可以用 `llvm-link` 把所有 bc 代码全部链接成一个单一的 llvm 代码。

***这样就可以基于一个 Translation Unit 的假设做程序分析***。


