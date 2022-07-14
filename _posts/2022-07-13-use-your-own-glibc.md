---
layout: post
title: "Compiling Applications with Your Own Musl-C"
date: 2022-07-13
tags: [cs,cpp,os]
---

## 参考资料

主要

* [Linux头脑风暴第18期——glibc还是musl？我的学习分享 - YouTube](https://www.youtube.com/watch?v=o9ObYKKP1vE)
* [linking hello world against musl built as LTO (github.com)](https://gist.github.com/nickdesaulniers/9d7407937427a22c816c4dfe258c02cc)
* [Dynamic Linker - OSDev Wiki](https://wiki.osdev.org/Dynamic_Linker)
* [Building and Using Shared Libraries on Linux - ***Shared Libraries: The Dynamic Linker***](https://man7.org/training/download/shlib_dynlinker_slides.pdf)

次要

*  NO.... 

## 原因

想预留 `%r14` 寄存器。选择 `%r14` 是因为 X86_64 ABI 里面没有出现相关描述，
而且由于 r14 是 non-volatile ，就算 Linux 的 system call 调用了也要帮忙恢复。

详情可以看 [如何在编译器中保留特定寄存器 - Readm的博客 - Readm Blog](http://readm.tech/2018/04/11/reserve-register/)

## Printing Shared Library Dependencies

```cpp
#include <stdio.h>

int main(){
	printf("hello world\n"); 
	return 0; 
}
```

```
clang hello.c -o hello
```

```
ldd hello
```

可以看到链接了 `lib/x86_64-linux-gnu/libc.so.6` 和 `lib64/ld-linux-x86-64.so.2`

The second file `lib64/ld-linux-x86-64.so.2` is the dynamic linker, you can run it directly from the terminal window

```
$ lib64/ld-linux-x86-64.so.2

....
You have invoked `ld.so`, the helper program for shared library executables. 
.... 
```

> **Disabling Default Library Linking: ** 
> In general, we have to tell the compiler not to link the default libraries silently by the flag `-nostdlib -nostdinc` . 
> If you would like to use the libcxx from LLVM as well, you may want to add `-nostdinc++`, but that is out of the topic. 
> See [Analyzing The Simplest C++ Program - Ray (oneraynyday.github.io)](https://oneraynyday.github.io/dev/2020/05/03/Analyzing-The-Simplest-C++-Program/) . 

## Specifying Dynamic Linker 

* [指定dynamic linker以使用高版本GCC - MaskRay](https://maskray.me/blog/2015-09-29-specify-dynamic-linker-to-use-higher-version-gcc)
* [Building and Using Shared Libraries on Linux - ***Shared Libraries: The Dynamic Linker***](https://man7.org/training/download/shlib_dynlinker_slides.pdf)
* *Building OpenMPI with a custom Glibc* <https://www.mail-archive.com/users@lists.open-mpi.org/msg32324/openmpi_glibc.pdf>

The default dynamic linker are `/lib/ld-linux.so.2` and  `lib64/ld-linux-x86-64.so.2`. 

In fact, we can specify which dynamic linker to use the following flag. 

```
-Wl,--dynamic-linker
```

## Specifying Library Search Paths in an Object or Executable 

[8.5. Glibc-2.35 (linuxfromscratch.org)](https://www.linuxfromscratch.org/lfs/view/stable/chapter08/glibc.html)

By default, the dynamic linker will search the system libraries from 

* **Option 1**: the environment variable `LD_LIBRARY_PATH`
* **Option 2**: the sublibraries from `$LIBC_DIR/lib` and the cache file `$LIBC_DIR/etc/ld.so.cache`
* **Option 3**: run-time library path (`rpath`) list

> **What is Sub-libraries?** 
> As LLVM, the glibc or musl-c is an umbrella project. The C standard library includes a few indepdendent libraries like `math.h`, `pthread.h`, `crt` and so on. 

> **Dynamic Linker Cache**
> We may want our custom libc have access to the system libraries (system call, for example), take glibc for example, update the cache 
>
> ```
> $ echo /lib64 > $GLIBC_DIR/etc/ld.so.conf
> $ echo /usr/lib64 >> $GLIBC_DIR/etc/ld.so.conf
> $ $GLIBC_DIR/sbin/ldconfig
> ```

## 附录: 使用 glibc (未完成)

As the official website complaints, building an application against glibc is really tricky. I don't have time to dive into it. 

Here are some articles that may be helpful. 

主要

* [Dynamic Linking and Loading with glibc - Chrome Developers](https://developer.chrome.com/docs/native-client/devguide/devcycle/dynamic-loading/)
* [Tips_and_Tricks/How_to_Build_an_application_with_your_own_custom_glibc - glibc wiki (sourceware.org)](https://sourceware.org/glibc/wiki/Tips_and_Tricks/How_to_Build_an_application_with_your_own_custom_glibc)
* [Building OpenMPI with a custom Glibc - lists.open-mpi.org](https://www.mail-archive.com/users@lists.open-mpi.org/msg32324/openmpi_glibc.pdf)
* [Optimizing ART: Radiative Transfer Forward Modeling Code for Solar Observations with ALMA](https://prace-ri.eu/wp-content/uploads/WP271.pdf)
* [Analyzing The Simplest C++ Program - Ray (oneraynyday.github.io)](https://oneraynyday.github.io/dev/2020/05/03/Analyzing-The-Simplest-C++-Program/)

其他

* [8.5. Glibc-2.35 (linuxfromscratch.org)](https://www.linuxfromscratch.org/lfs/view/stable/chapter08/glibc.html)
* [Welcome to Linux From Scratch!](https://www.linuxfromscratch.org/)
* [【Linux From Scratch】Compiling Glibc For 2 Hours!! - YouTube](https://www.youtube.com/watch?v=WjSOXMZWWgU)
* [Flexin Musl on Void Linux - YouTube](https://www.youtube.com/watch?v=rRFIlBIYCBY)

---

### 编译 glibc

* <https://www.gnu.org/software/libc/started.html>
* <https://prace-ri.eu/wp-content/uploads/WP271.pdf>

```bash
git clone https://sourceware.org/git/glibc.git
cd glibc
git checkout release/2.28/master
mkdir build
cd build
../configure --prefix=$GLIBC_DIR
make -j4
make check
```

The glibc may fail a few tests, I think that is fine. 

> You may see some test failures. The Glibc test suite is somewhat dependent on the host system.
>
> *Linux From Scratch* - Version 11.1 <https://www.linuxfromscratch.org/lfs/view/stable/chapter08/glibc.html>

```
make install
```

Our glibc needs to have access to system libraries (from the Linux system), so update the cache of our glibc 



