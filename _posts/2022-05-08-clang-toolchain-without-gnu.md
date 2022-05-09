---
layout: post
title: "Docker Clang Toolchain (with Musl libc)"
date: 2022-05-08
tags: [cs,os,cpp]
---
[genshen/docker-clang-toolchain: clang-toolchain without gnu. (github.com)](https://github.com/genshen/docker-clang-toolchain)

Docker 的镜像文件是 Alpine , 是 BusyBox 和 Musl libc。

如果编译出 `clang` 就可以完全避免 `gcc`

一般而言，是先用 `gcc` 编译 `clang` (llvm, clang, libc++, libc++abi, compiler-rt) ，然后用生成的 clang 再编译 LLVM-project 一次。

所以会见到很多人是编译两次的

[build-clang-llvm/alpine_3.10.1.Dockerfile at master · coldfusionjp/build-clang-llvm (github.com)](https://github.com/coldfusionjp/build-clang-llvm/blob/master/Dockerfiles/alpine_3.10.1.Dockerfile)

---

因为实验环境的要求，只能支持 Musl libc 的 C 函数库。

所以就有了这次尝试。

---

[Build with pure LLVM toolchain on Linux · Issue #65051 · rust-lang/rust (github.com)](https://github.com/rust-lang/rust/issues/65051)

宋方睿 **[MaskRay](https://github.com/MaskRay)** commented [on Oct 3, 2019](https://github.com/rust-lang/rust/issues/65051#issuecomment-537862559)

> Configure llvm with `-DCLANG_DEFAULT_RTLIB=compiler-rt` so that clang will link against `libclang_rt.builtin*.a` instead of `-lgcc` or `-lgcc_s`.
>
> Alternatively, use link option `-rtlib=compiler-rt`.
>
> Since clang 9, `--unwindlib={none,libunwind}` (`-DCLANG_DEFAULT_UNWINDLIB`) is available. This option can be used to avoid `-lgcc_s` or `-lgcc_eh`. I don't remember the status before r356508, but with --rtlib=compiler-rt, by default no unwind lib is linked in. If you use clang 8 and somehow some object files require a unwind lib, you may need explicit `-Wl,-lunwind`.
>
> `-DCLANG_DEFAULT_CXX_STDLIB=libc++` if you want to use libc++ by default. On most Linux distributions, the default is libstdc++. libc++abi.so is linked because libc++.so is a linker script (`INPUT(libc++.so.1 -lc++abi)`) that adds libc++abi.so. Your compiler driver is `clang`, not `clang++`, so C++ stdlib will not be linked.

---

## LLVM 介绍

主要是一些是三个主要的项目 和 其他几个 C/C++ 的库。

<https://elinux.org/images/3/3a/ELC_2020_clang.pdf>

### LLVM Compiler

这些是 LLVM compiler 的主要项目，后面的 Runtime 实际上有很多替代项，比如 GNU glibc , Musl libc 

- **llvm** 
- **clang**
- **lld**

### LLVM Runtime

这部分可以依赖 gcc 或者 musl libc ，不过需要额外的 symbolic link 处理。

- **compiler-rt**
  - compiler built-ins
  - sanitizer runtimes
  - profile
- **libc++**
  - libc++
  - libc++abi
- **libunwind**

---

## Clang without GNU

[genshen/docker-clang-toolchain: clang-toolchain without gnu. (github.com)](https://github.com/genshen/docker-clang-toolchain)

主要是利用先用 gcc 编译一次 (几乎全部 subproject, `clang;libcxx;libcxxabi;compile-rt` ，那个 sanitizer 可能有问题)，之后用生成的 clang 再编译一次。

这样就能完全摆脱 GNU 的代码。

---

## Alpine + Musl Libc + Clang Minimum Build 

[build-clang-llvm/alpine_3.10.1.Dockerfile at master · coldfusionjp/build-clang-llvm (github.com)](https://github.com/coldfusionjp/build-clang-llvm/blob/master/Dockerfiles/alpine_3.10.1.Dockerfile)

[解决Clang编译器出现/usr/bin/ld: crtbegin.o: No such file: No such file or directory_witton的博客-CSDN博客](https://blog.csdn.net/witton/article/details/109386800)

**[build-clang-llvm/alpine_3.10.1.Dockerfile at master · coldfusionjp/build-clang-llvm (github.com)](https://github.com/coldfusionjp/build-clang-llvm/blob/master/Dockerfiles/alpine_3.10.1.Dockerfile)**

如果只想编译 Clang 和 LLVM 的话 (用 LLVM 就被迫要用 Clang ，目前好像没有其他办法)，

- 先编译 lld 或者 下载 lld 
- 可以让 Clang 先依赖于 gcc 的 compiler runtime 
  - musl crtbegin/crtend/libgcc
    - crtbeginS.o `/usr/lib/gcc/x86_64-alpine-linux-musl/x.x.x/crtbeginS.o`
    - crtendS.o `/usr/lib/gcc/x86_64-alpine-linux-musl/x.x.x/crtendS.o`
    - libgcc.a `/usr/lib/gcc/x86_64-alpine-linux-musl/x.x.x/libgcc.a`

### libc / musl-libc

用 `clang -v` 查看当前的 Target, 比如当前返回的是 

```
clang version 13.0.0
Target: x86_64-unknown-linux-musl
Thread model: posix
InstalledDir: /haohua/llvm-project/clang-build/bin
```

然而实际上 `gcc` 的 libc 是 `x86_64-alpine-linux-musl` ，所以要创建一个软链接。

```bash
ln -s /usr/lib/gcc/x86_64-alpine-linux-musl/ /usr/lib/gcc/x86_64-unknown-linux-musl
```

### libstdc++

[alpine clang에 c++ 제목이 없습니다 - coder-solution.com](https://coder-solution.com/solution-blog/206051)

[docker - Missing c++ headers under alpine clang - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/561158/missing-c-headers-under-alpine-clang)

[c - -I dir vs. -isystem dir - Stack Overflow](https://stackoverflow.com/questions/2579576/i-dir-vs-isystem-dir)

可以看一看当前的 `libstdc++` 是谁的 (其中的 `x.x.x` 是 gcc 的版本)

```bash
apk info --who-owns /usr/include/c++/x.x.x/iostream
```

> One way to view this is to use headers that you control with `-I` and the ones you don't (system, 3rd party libs) with `-isystem`. The practical difference comes when warnings are enabled in that warnings which come from `-isystem` headers will be suppressed.
>
> by Laurynas Biveinis
>
> <https://stackoverflow.com/questions/2579576/i-dir-vs-isystem-dir>

使用 `-isystem` 把有所有缺的都加上来

- `/usr/include/c++/x.x.x/`
- `/usr/include/c++/x.x.x/x86_64-alpine-linux-musl`
- C++ 也会依赖 libc , 所以 `ln -s /usr/lib/gcc/x86_64-alpine-linux-musl/ /usr/lib/gcc/x86_64-unknown-linux-musl`



