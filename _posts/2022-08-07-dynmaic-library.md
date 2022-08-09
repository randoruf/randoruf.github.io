---
layout: post
title: '如何使用动态库?'
date: 2022-08-07
tags: [cpp]
---

* Advanced Programming in the UNIX Environment: Week 11, Segment 3 - Shared Libraries <https://www.youtube.com/watch?v=eloJO0ssrfc>
* 《程序员的自我修养—链接、装载与库》
* <https://amir.rachum.com/blog/2016/09/17/shared-libraries/>


主要看 ***Advanced Programming in the UNIX Environment: Week 11, Segment 3 - Shared Libraries***
## Shared Library 
Library 就是**预先编译好的模块**。比较典型的就是 glibc, stdc++ (STL) 等等。显然使用 Library 可以显著加快编译速度。

比较常见的 Library 有两种形式
* ***Static Library*** `libxxx.a`
* ***Shared Library*** `libxxx.so` 或者 `libxxx.dylib`

**Static Library** 无需依赖，但代码会不可避免的膨胀。

**Shared Library** 也叫 **Runtime Library**, 仅当执行代码时才载入。可以显著较小代码。

我们都知道 C++程序 可以兼容 C 程序。
但是 C 程序如何调用 C++ 程序呢? 秘密就是 Shared Library 。


## Build a Shared Library
[<https://gist.github.com/randoruf/d639d7085ac2d96f25f5893d653f659b>](https://gist.github.com/randoruf/d639d7085ac2d96f25f5893d653f659b)

设 `<name>=runtime` ，代码文件为 `runtime.cpp` 。 
```cpp
#include <cstdio>
#include <stdio.h>
#include <string>
#include <vector>
#include <algorithm>

extern "C" { 
void sort_vector_example(){ 
    std::vector<int> arr = { 88, 56, 100, 2, 25 };
    printf("["); 
    for (int i : arr) printf("%d  ", i); 
    printf("]\n"); 
    
    std::sort(arr.begin(), arr.end()); 
    
    printf("["); 
    for (int i : arr) printf("%d  ", i); 
    printf("]\n"); 
    return;
}

void hello_world_example(){
    std::string s = "Hello World!"; 
    printf("%s \n", s.c_str()); 
}
}
```
输出库的名称必须叫 `lib<name>.so`
```shell
clang++ -dynamiclib runtime.cpp -o libruntime.dylib
```

## How to Link Dynamic Library? 

下面集中讨论如何使用 **"Runtime Library"**

### Using Search Path 

`hello.c`
```c
#include <stdio.h>

extern void sort_vector_example(); 
extern void hello_world_example(); 

int main(){
    sort_vector_example(); 
    hello_world_example(); 
}
```

`Makefile`
```makefile
all:  
	clang++ -dynamiclib runtime.cpp -o libruntime.dylib
	clang -L./ -lruntime hello.c -o hello 

clean: 
	rm -f libruntime.dylib hello 
```
* 其中 `libruntime.dylib` 的 `lib` 和 `.dylib` 都非常重要。
* `-L` 是 search path 
* `-l` 是 library name 

可以使用 `ldd hello` 或者 `otool -L hello` 查看是否链接成功
```
hello:
        libruntime.dylib (compatibility version 0.0.0, current version 0.0.0)
        /usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1311.100.3)
```

也可以通过 `readelf -d hello | grep NEEDED` 查看直接依赖。



### Compiling with Source Code Directly 
和上面的步骤基本相似
```makefile
    clang++ -dynamiclib runtime.cpp -o libruntime.dylib
    clang hello.c libruntime.dylib -o hello 
```

### 使用 rpath 和 runpath

(因未知原因，以下代码不没有效果)。

`rpath` 和 `runpath` 都是直接写入到 elf 上的。

一般都写 ***absolute path***, 但也可以当前 executable 的 relative path 。 


```
clang -Wl,-rpath,"/path/to/rtlib" -L./ -lruntime hello.c -o hello 
```




### 使用 LD_LIBRARY_PATH
在编译后，你还可以直接指定库的绝对路径。当程序找不到时，就会到 `LD_LIBRARY_PATH` 下自动寻找。

```
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/path/to/libruntime.dylib
```

## 依赖的寻找顺序

Each shared library in our dependencies is searched in the following locations, in order:

1. Directories listed in the executable’s `rpath`.
2. Directories in the `LD_LIBRARY_PATH` environment variable, which contains colon-separated list of directories (e.g., `/path/to/libdir:/another/path`)
3. Directories listed in the executable’s `runpath`.
4. The list of directories in the file `/etc/ld.so.conf`. This file can include other files, but it is basically a list of directories - one per line.
5. Default system libraries - usually `/lib` and `/usr/lib` (skipped if compiled with `-z nodefaultlib`).

## ELF - Executable and Linkable Format

TODO: 学习什么是 ELF


* PIC GOT PLT OMG: how does the procedure linkage table work in linux? <https://www.youtube.com/watch?v=Ss2e6JauS0Y>

* In-depth: ELF - The Extensible & Linkable Format <https://www.youtube.com/watch?v=nC1U1LJQL8o>

* Deep Dive Into ELF Binaries - ELF Binary Structure for Pentesters/CyberSecurity <https://www.youtube.com/watch?v=ddLB8A1ai_M>

## 可用资料
* Clang linking with a .so file <https://stackoverflow.com/questions/25160245/clang-linking-with-a-so-file>
* Create dynamic library from cpp files and static library with clang <https://stackoverflow.com/questions/31988594/create-dynamic-library-from-cpp-files-and-static-library-with-clang>
* Using C++ library in C code <https://stackoverflow.com/questions/199418/using-c-library-in-c-code>
* Static and Dynamic Libraries <http://nickdesaulniers.github.io/blog/2016/11/20/static-and-dynamic-libraries/>
* Shared Libraries: Understanding Dynamic Loading <https://amir.rachum.com/blog/2016/09/17/shared-libraries/>
