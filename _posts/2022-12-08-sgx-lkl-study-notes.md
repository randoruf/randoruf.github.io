---
layout: post
title: 'SGX-LKL-OE 学习笔记'
date: 2022-12-08
tags: [linux]
---

* TOC 
{:toc}

---


## Git 配置

由于总所周知的原因，Git 默认的 SSH 协议速度十分慢。

在大陆想使用 Git 可以转到 HTTPS 协议。速度会稍微快一点。或者你懂的上网方法。

<https://gist.github.com/taoyuan/bfa3ff87e4b5611b5cbe>

```
# npm using https for git
git config --global url."https://github.com/".insteadOf git@github.com:
git config --global url."https://".insteadOf git://
```

最好的方法当然是自己搭建一条专线。

## 对 OpenEnclave 的修改

Open Enclave 版本 <https://github.com/openenclave/openenclave/commits/mikbras.isolation>

一共有 13 个 commits。

点击 "This branch is 13 commits ahead" 处，可以看到到底是哪 13 个 commits。

**继续点下去可以看到对应的 Pull Request** 

<https://github.com/openenclave/openenclave/pull/3425>

Secondary ELF memory region (for feature/sgx-lkl/support branch only) #3425


