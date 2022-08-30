---
layout: post
title: '在 Ubuntu 上使用 musl-libc'
date: 2022-08-23
tags: [llvm]
---

* TOC 
{:toc}

---

## 一个奇怪的 Bug: Linker 可能不支持 musl-libc

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

## 在 Ubuntu 使用 musl-lib 编译 OpenSSL 的艰辛之旅

在 Ubuntu 编译 OpenSSL 会遇到一堆问题。

首先是 `musl-gcc` 是不能链接 Linux Header 的, 你需要自己写一个 `musl-clang` 去规避这个问题。

1. 在 Ubuntu 上安装 Clang <https://randoruf.github.io/2022/01/18/llvm-installation.html>
2. 写一个 `musl-clang` (目前还不支持 C++) <https://gist.github.com/randoruf/d1aa4e8acb0a852addcd2b84fc003719>


<https://stackoverflow.com/questions/53187897/fixing-dynamic-linker-errors-when-using-libc-with-openssl/73498286#73498286>

### 如果 musl-libc 和 glic 混用的后果

就是会提示缺失 symbols 

It seems that your OpenSSL is **not built against musl-libc**. 


The musl-libc has its own dynamic linker (see <https://wiki.musl-libc.org/faq.html>), we could create a soft link for the musl dynamic linker. (`-syslibdir` is the directory in which the dynamic library, e.g. `ld-musl-x86_64.so.1`, is, see <https://wiki.musl-libc.org/getting-started.html>)

```bash
sudo ln -sf <YOUR-MUSL-LIBC-syslibdir/ld-musl-x86_64.so.1> /usr/bin/musl-ldd  
``` 

Then you could see whether openssl is built against musl-libc. When I build OpenSSL using glibc, it shows the following error

```bash
$ musl-ldd <YOUR-OPENSSL-SRC>/libcrypto.so.1.1
        musl-ldd (0x7fcd5a749000)
        libdl.so.2 => musl-ldd (0x7fcd5a749000)
        libpthread.so.0 => musl-ldd (0x7fcd5a749000)
        libc.so.6 => musl-ldd (0x7fcd5a749000)
Error relocating ./libcrypto.so.1.1: makecontext: symbol not found
Error relocating ./libcrypto.so.1.1: setcontext: symbol not found
Error relocating ./libcrypto.so.1.1: __register_atfork: symbol not found
Error relocating ./libcrypto.so.1.1: getcontext: symbol not found
```
And the glib dynamic linker works fine, 
```bash
$ ldd <YOUR-OPENSSL-SRC>/libcrypto.so.1.1
        linux-vdso.so.1 (0x00007ffd395a6000)
        libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007ff6e6e64000)
        libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007ff6e6e41000)
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007ff6e6c4f000)
        /lib64/ld-linux-x86-64.so.2 (0x00007ff6e71d7000)
```
 
To build OpenSSL using musl-libc, we have to also specify the location of linux headers to avoid errors like `<linux/mman.h>`

I only have attempted to build OpenSSL using Clang and Musl-libc, here is the clang wrapper I used <https://gist.github.com/randoruf/d1aa4e8acb0a852addcd2b84fc003719>. 

(taken from <https://qiita.com/kakinaguru_zo/items/399ab7ea716a56aef50c> which is written by kakinaguru_zo)

But **there are still a few issues in the clang-wrapper**. 

This wrapper will link the startfile (`e.g. Scrt1.o`) regardless of building libraries or executables. Apparently, only executables need startfile. Hence, if you use this wrapper, you may encounter the following strange error (`main` symbol not found): 

```
$ musl-clang mylibrary.c -shared -fPIC -o libmylibrary.so
$ musl-ldd libmylibrary.so
        ld-musl-x86_64.so.1 (0x7f49faef7000)
        libc.so => ld-musl-x86_64.so.1 (0x7f49faef7000)
Error relocating libmylibrary.so: main: symbol not found
``` 
Since the library has the startfile, it may have an entry to `main`. This is the reason why the `main` symbol is not found. 

Another issue is that `test_errstr`, `test_ca`, `test_ssl_new` will not pass. See [Why these test case will fail?](#about-the-test-case-in-openssl)

The final issue is that this wrapper only supports c language. Another wrapper may be helpful see <https://github.com/esjeon/musl-clang/blob/master/musl-clang>

I will update and fix it later. 


### About the Test Case in OpenSSL

#### `test_errstr`
glic and musl-c have different descriptions for the same error code, 

for example, in glibc 
```
define[EADDRINUSE] str[Address already in use]
```

But in musl-c 

```
E(EADDRINUSE,   "Address in use")
```

If the target system is different (ths operating system is not built against musl-c), these three cases will fail. 

This could be found at `test/recipes/02-test_errstr.t`

```
my $perr = eval {
    # Set $! to the error number...
    local $! = $errnum;
    # ... and $! will give you the error string back
    $!
};
...
ok($oerr[0] eq $perr, "($errnum) '$oerr[0]' == '$perr'");
```

We can see that the openssl test compares the error code with perl. 


#### `test_ca` and `test_ssl_new`

These two test cases have the following errors: 

```
$ ../../util/shlib_wrap.sh /usr/bin/perl -I ../../util/perl ../generate_ssl_tests.pl ../ssl-tests/01-simple.conf.in > 01-simple.conf.4548.tmp

/usr/bin/perl: error while loading shared libraries: /lib/x86_64-linux-gnu/libc.so: invalid ELF header
```

We can trace back to `shlib_wrap.sh` file, and we can see that 

```
LIBCRYPTOSO="${THERE}/libcrypto.so.1.1"
LIBSSLSO="${THERE}/libssl.so.1.1"
...
LD_LIBRARY_PATH="${THERE}:$LD_LIBRARY_PATH"	# Linux, ELF HP-UX
```

It means the shell script wants to load our musl-openssl as normal `.so` file. 

To verify this thought, use the `ldd` to load the musl-openssl. 

```
$ ldd libcrypto.so.1.1 
./libcrypto.so.1.1: error while loading shared libraries: /lib/x86_64-linux-gnu/libc.so: invalid ELF header
```
This time it gives useful error info. 
