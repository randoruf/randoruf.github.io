---
layout: post
title: '在 Ubuntu 上使用 musl-libc'
date: 2022-08-23
tags: [llvm]
---

* TOC 
{:toc}

---

## 一个奇怪的 Bug

一开始使用 `musl-gcc` 静态编译 Hello World 会直接出现 Segmentation Fault .

摸不着头脑， 看到别人用 `strace` 追踪系统调用 (从 ***How the hell-o world?!*** <https://soccasys.com/2018/05/20/how-the-hell-o-world/>) 

```
$ strace ./hello
execve("./hello", ["./hello"], 0x7fff219031e0 /* 27 vars */) = 0
--- SIGSEGV {si_signo=SIGSEGV, si_code=SEGV_MAPERR, si_addr=0x400040} ---
+++ killed by SIGSEGV (core dumped) +++
Segmentation fault (core dumped)
```

这时候上网搜了一下才搜到 <https://bbs.archlinux.org/viewtopic.php?id=239533>

原来是一个 Bug <https://bugs.archlinux.org/task/59540>


大概原因如下(看不懂)

```
Details
Description:
Simple static linking is broken with 2.31 ld because it does not put program headers into a load section unless there is some other read only loaded section. Causes applications build with musl-gcc and musl-clang to segfault.

The bug tracker for binutils shows it was fixed on 2018-07-23 and the last comment says "Fixed for 2.32 and on 2.31 branch", Link:
https://sourceware.org/bugzilla/show_bug.cgi?id=23428

I don't know if a back-port is required or just an update on the 2.31 branch.

Additional info:
package: binutils 2.31.1-1

Steps to reproduce:
http://www.openwall.com/lists/musl/2018/07/18/6
using musl-static
````

然后看了看 **binutils** 的版本是对的。再看一看 Linker, 发现 Linker 是 lld 13.0。

把 Linker 换回来


```
sudo update-alternatives --set                      ld      /bin/ld.bfd
```

然后再编译就奇迹般地没事了。

```
musl-gcc -static -Os hello.c
```

这看起来是 `lld` 的一个 bug 。

可以看 <https://sourceware.org/bugzilla/show_bug.cgi?id=23428>

