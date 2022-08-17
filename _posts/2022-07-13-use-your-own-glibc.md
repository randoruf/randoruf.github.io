---
layout: post
title: "Use Your Own Shared/Static C Library"
date: 2022-07-13
tags: [cs,cpp,os]
---

> **注意**: 
> 只有 Linux 才允许自定义标准库。所以以下示例全部基于 Linux 。
## 指定 Library Search Paths 

要告诉 dynamic linker (DL) shared library 的位置有两种方法

* 安装到标准目录，如 `\lib`, `\usr\lib` 等等。
* 用 `LD_LIBRARY_PATH` 加入新的 `.so` 文件。

还有第三种方法，在静态编译时，把路径(a list of directories)直接写入 ELF 文件里 

即 **“run-time library path (rpath) list”**

如需写入目录，一般是
(可以理解为 `-Wl` 是给 linkder 的参数)

```bash
gcc -Wl,-rpath,path-to-lib-dir
```
* 可以使用多个 `-Wl,-rpath,` 参数
* 也可以使用一个 `-Wl,rpath,` 后面接上多个路径(使用 colon-separated list)

据说 `-rpath` 本身是个 design 错误，

可以用 `DT_RUNPATH` 在运时覆盖，但不是这里的重点。反正我不觉得有什么错误。

### Dynamic string tokens
Dynamic Linker 认识一下特殊的 token ，例如 

```
gcc -Wl,-rpath,'$ORIGIN/lib'
```

不过不是这里的重点, 反正都会用绝对路径的。

### Finding Shared Libraries at Run Time 
1. 看一看 `DT_RPATH` (即 **rpath**)
2. 看一看 `LD_LIBRARY_PATH`
3. 看一看 `DT_RUNPATH`
4. 看一看 `/etc/ld.so.cache`
5. 再看一看 `/lib64` 和 `/usr/lib64`




## 参考资料
* [Advanced Programming in the UNIX Environment: Week 11, Segment 2 - Of Linkers and Loaders](https://www.youtube.com/watch?v=8KWuz7gLycc&t=508s)
* [Building and Using Shared Libraries on Linux Shared Libraries: The Dynamic Linker](https://man7.org/training/download/shlib_dynlinker_slides.pdf)
* [Dynamic Linker - OSDev Wiki](https://wiki.osdev.org/Dynamic_Linker)
* [指定dynamic linker以使用高版本GCC - MaskRay](https://maskray.me/blog/2015-09-29-specify-dynamic-linker-to-use-higher-version-gcc)
* [openmpi_glibc.pdf](https://www.mail-archive.com/users@lists.open-mpi.org/msg32324/openmpi_glibc.pdf)
* [8.5. Glibc-2.35 (linuxfromscratch.org)](https://www.linuxfromscratch.org/lfs/view/stable/chapter08/glibc.html)
* [How_to_Build_an_application_with_your_own_custom_glibc - glibc wiki (sourceware.org)](https://sourceware.org/glibc/wiki/Tips_and_Tricks/How_to_Build_an_application_with_your_own_custom_glibc)
* [Analyzing The Simplest C++ Program - Ray (oneraynyday.github.io)](https://oneraynyday.github.io/dev/2020/05/03/Analyzing-The-Simplest-C++-Program/)
* [【Linux From Scratch】Compiling Glibc For 2 Hours!! - YouTube](https://www.youtube.com/watch?v=WjSOXMZWWgU)
