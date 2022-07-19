---
layout: post
title: "LLVM安装"
date: 2022-01-18
tags: [llvm]
---

## 参考资料

小小记录一下 LLVM 的安装，主要参考 

- [Getting Started with the LLVM System — LLVM 13 documentation](https://llvm.org/docs/GettingStarted.html)
- [llvm-adventure/Build LLVM on macOS.md at master · appcypher/llvm-adventure (github.com)](https://github.com/appcypher/llvm-adventure/blob/master/Build LLVM on macOS.md)
- [Mac 编译 llvm / mlir - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/430469470)
- [LLVM 入门教程之基本介绍 - Yuuoniy's blog](https://blog.yuuoniy.cn/posts/llvm-1/)
- [Git clone仓库的一个子目录 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/54581830)
- [Building LLVM with CMake — LLVM 13 documentation](https://llvm.org/docs/CMake.html)
- 【书】Getting Started with LLVM Core Libraries
- 【书】LLVM12 

## 最简单的 LLVM 安装

主要参考 <https://apt.llvm.org/>

添加安装源 ，打开 `/etc/apt/sources.list` ，在任意一处添加以下内容

```
# Bionic LTS (18.04) - Last update : Mon, 18 Jul 2022 19:28:06 UTC / Revision: 20220718064109+dbed4326dd9c
deb http://apt.llvm.org/bionic/ llvm-toolchain-bionic main
deb-src http://apt.llvm.org/bionic/ llvm-toolchain-bionic main
# Needs 'sudo add-apt-repository ppa:ubuntu-toolchain-r/test' for libstdc++ with C++20 support
# 13
deb http://apt.llvm.org/bionic/ llvm-toolchain-bionic-13 main
deb-src http://apt.llvm.org/bionic/ llvm-toolchain-bionic-13 main
# 14
deb http://apt.llvm.org/bionic/ llvm-toolchain-bionic-14 main
deb-src http://apt.llvm.org/bionic/ llvm-toolchain-bionic-14 main
```

然后更新

```
sudo apt update
```

添加签名

```
sudo wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key|sudo apt-key add -
```

运行如下脚本安装

```
sudo bash -c "$(wget -O - https://apt.llvm.org/llvm.sh)"
```

我期望用的是 LLVM Toolchain ，所以仅仅 Clang, LLVM, LLD 是完全不够的。

参考

* [build-clang-llvm/alpine_3.10.1.Dockerfile at master · coldfusionjp/build-clang-llvm (github.com)](https://github.com/coldfusionjp/build-clang-llvm/blob/master/Dockerfiles/alpine_3.10.1.Dockerfile)
* [docker-clang-toolchain/Dockerfile at master · genshen/docker-clang-toolchain (github.com)](https://github.com/genshen/docker-clang-toolchain/blob/master/Dockerfile)

```bash
# LLVM
sudo apt-get install libllvm-14-ocaml-dev libllvm14 llvm-14 llvm-14-dev llvm-14-doc llvm-14-examples llvm-14-runtime
# Clang and co
sudo apt-get install clang-14 clang-tools-14 clang-14-doc libclang-common-14-dev libclang-14-dev libclang1-14 clang-format-14 python3-clang-14 clangd-14 clang-tidy-14
# lldb
sudo apt-get install lldb-14
# lld (linker)
sudo apt-get install lld-14
# libc++
sudo apt-get install libc++-14-dev libc++abi-14-dev
# libunwind
sudo apt-get install libunwind-14-dev
```

安装完成后还有几点值得注意

* 默认的 symbolic links 
* 在 `.bashrc` 把 clang 设置为默认 toolchain 
* 在环境变量中把 gcc 变成 clang 

安装完成后，由于默认的是 **clang-xx** ，需要  **update-alternatives** (由于可能会有多个版本的 LLVM Toolchain, 需要手动指定哪个版本可以有最高优先级)。参考这个脚本 

* <https://gist.github.com/randoruf/194780ba1de290efd9a8f67e7fd40afc>
* [LLVM-14.0.6 (linuxfromscratch.org)](https://www.linuxfromscratch.org/blfs/view/svn/general/llvm.html) 

如果不够，可以到 ***Beyond Linux® From Scratch*** 查看 LLVM 一章，按需增加。

以 LLVM 14 为例，设置 1 优先级

```bash
chmod +x update-alternatives-clang.sh
sudo ./update-alternatives-clang.sh 14 1


sudo update-alternatives --install /usr/bin/cc      cc      /usr/local/llvm/bin/clang   1
sudo update-alternatives --install /usr/bin/c++     c++     /usr/local/llvm/bin/clang++ 1
sudo update-alternatives --install /usr/bin/ld      ld      /usr/local/llvm/bin/ld.lld  1
sudo update-alternatives --set                      cc      /usr/local/llvm/bin/clang  
sudo update-alternatives --set                      c++     /usr/local/llvm/bin/clang++ 
sudo update-alternatives --set                      ld      /usr/local/llvm/bin/ld.lld
```

```bash
sudo apt install binutils 
sudo apt install zlib1g
sudo apt install zlib1g-dev
sudo apt-get install linux-headers-$(uname -r)
```

由于 LLVM 在默认情况下依旧调用 **glibc** (例如 libgcc runtime)，我们需要让其默认链接 libc++ 

* [bash - How do I add environment variables? - Ask Ubuntu](https://askubuntu.com/questions/58814/how-do-i-add-environment-variables)

打开 `.bashrc`

```bash
# set llvm toolchain as default
export CC=clang
export CXX=clang++
# export CFLAGS=""
export CXXFLAGS="-stdlib=libc++"
export LDFLAGS="-rtlib=compiler-rt -unwindlib=libunwind -stdlib=libc++ -lc++ -lc++abi"
```

(否则会自动 `-rtlib=libgcc` )

为了验证是否成功，可以尝试使用 LLVM address sanitizer 

```cpp
int main(int argc, char **argv) {
  int *array = new int[100];
  delete [] array;
  return array[5];  // BOOM
}
```

```bash
clang++ -O0 -g -fsanitize=address hello.cpp
```

## 从源码编译

### 最低配置

[ubuntu 虚拟机环境下 安装 配置 Clang/LLVM - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/36769900)

> LLVM非常耗内存，LLVM非常耗内存，LLVM非常耗内存，实测需要10G左右内存，
>
> 没有这个内存，肯定需要一些其他方法来进行相关处理！！！！
>
> ***基本都是在ld的时候，内存不足的错误。***

```bash
collect2: fatal error: ld terminated with signal 9 [Killed]
```

- **硬盘空间**: 
  - 预留至少 30 GB 给 LLVM 生成的中间二进制

- **内存**: 
  - linking 至少需要 5 GB。 
    - 比如我在 Docker Container 里面 Build LLVM， 然后发现内存直接炸了。
    - 记得查一查 container 最大可以使用的内存。

  - 把 `ld` 换成 `ld.lld`  
  - 创建 swap 交换区


> **题外话**: 开发机推荐至少 32 GB 内存， CPU 6 核左右。特别是内存越大越好。一个 docker 可能就占至少 8 GB (好像是因为 hyperkit 的性能问题)。
> 反而是像 AMD 那种线程撕裂者大可不必，因为大多数软件的优化根本跟不上，那是提供给有自己专业软件的企业的。

**[How do I add swap after system installation? - Ask Ubuntu](https://askubuntu.com/questions/33697/how-do-i-add-swap-after-system-installation)**

**[Releases - The Haskell Tool Stack (haskellstack.org)](https://docs.haskellstack.org/en/v1.9.3/maintainers/releases/)**

创建一个临时文件

```bash
sudo dd if=/dev/zero of=/tmp/swap1 bs=1M count=8192
sudo chmod 600 /tmp/swap1
```

格式化为交换分区

```bash
mkswap /tmp/swap1
```

挂载交换分区 

```bash
swapon /tmp/swap1
```

可以查看是否成功

```
free
top -bn1 | grep -i swap
```

应该返回 `KiB Swap:  4194300 total,  4194300 free`

去掉分区

```bash
swapoff /tmp/swap1
```

### Ubuntu LLVM Toolchain 

#### 手动安装

如果是 distro , 可以下载 ***LLVM Toolchain*** 来编译 LLVM 。

要注意的是 **Deb 可能不包含 LLVM 的源**， 要到 `/etc/apt/sources.list` 手动添加源告诉 deb 在哪里下载 LLVM 。详见 [repository - Why am I getting "Command 'deb' not found"? - Ask Ubuntu](https://askubuntu.com/questions/233064/why-am-i-getting-command-deb-not-found)

- 把  [LLVM Debian/Ubuntu packages](https://apt.llvm.org/) 里面出现的 deb 加到 `sources.list` 文件即可。

 **不得不说 `apt` 真是有毛病**。添加源的时候，竟然允许瞎加 `list` 文件。

- `/etc/apt/sources.list` 
- `/etc/apt/sources.list.d` 文件夹下的所有 `.list` 文件也会造成影响。 

以 Ubuntu 18.04 为例 (注意 bionic 位 Ubuntu 18.04 的代号，不同 Ubuntu 版本需要修改)。

```
deb http://apt.llvm.org/bionic/ llvm-toolchain-bionic-9 main
deb-src http://apt.llvm.org/bionic/ llvm-toolchain-bionic-9 main
```

- 按照 [LLVM Debian/Ubuntu packages](https://apt.llvm.org/) 的步骤添加 public key 
  - [apt - Error getting access to LLVM Debian/Ubuntu nightly packages - Ask Ubuntu](https://askubuntu.com/questions/895786/error-getting-access-to-llvm-debian-ubuntu-nightly-packages)

```
wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key|sudo apt-key add -
# Fingerprint: 6084 F3CF 814B 57C1 CF12 EFD5 15CF 4D18 AF4F 7421
```

然后就可以开始安装了。(安装之前记得 `sudo apt update` 更新一下源)

```
sudo apt install clang-9 lldb-9 lld-9
sudo apt install libc++-9-dev libc++abi-9-dev
sudo apt install libunwind-9-dev
sudo apt install libllvm9 llvm-9 llvm-9-dev llvm-9-runtime
```

#### 两次编译

否则可能就需要 按照 [docker-clang-toolchain/Dockerfile at master · genshen/docker-clang-toolchain (github.com)](https://github.com/genshen/docker-clang-toolchain/blob/master/Dockerfile) 的参数配置。也就是分两次编译。

```dockerfile
ARG ALPINE_VERSION=3.15
ARG LLVM_VERSION=14.0.0
ARG INSTALL_PREFIX=/usr/local
ARG LLVM_INSTALL_PATH=${INSTALL_PREFIX}/lib/llvm

FROM alpine:${ALPINE_VERSION} AS builder

# install prerequisites
RUN apk add --no-cache build-base cmake curl git linux-headers ninja python3 wget zlib-dev

# download sources
ARG LLVM_VERSION
ENV LLVM_DOWNLOAD_URL="https://github.com/llvm/llvm-project/releases/download/llvmorg-${LLVM_VERSION}/llvm-project-${LLVM_VERSION}.src.tar.xz"
ENV LLVM_SRC_DIR=/llvm_src
RUN mkdir -p ${LLVM_SRC_DIR} \
    && curl -L ${LLVM_DOWNLOAD_URL} | tar Jx --strip-components 1 -C ${LLVM_SRC_DIR}

# patch sources (it is also stored in patch directory)
# see discussion in: https://github.com/llvm/llvm-project/issues/51425
# NOTE patch from https://github.com/emacski/llvm-project/tree/13.0.0-debian-patches
RUN curl -L https://github.com/emacski/llvm-project/commit/2fd6a43c9adf6f05936e59a379de236b5d8885b6.diff | patch -ruN --strip=1 -d /llvm_src

# documentation: https://llvm.org/docs/BuildingADistribution.html

# build projects with gcc toolchain, runtimes with newly built projects
# NOTE for some reason LIB*_USE_COMPILER_RT is not passed to runtimes... Using CLANG_DEFAULT_RTLIB instead.
ARG INSTALL_PREFIX
ENV INSTALL_PREFIX=${INSTALL_PREFIX}
ARG GCC_LLVM_INSTALL_PATH=${INSTALL_PREFIX}/lib/gcc-llvm
RUN cd ${LLVM_SRC_DIR}/ \
    && cmake -B./build -H./llvm -DCMAKE_BUILD_TYPE=Release -G Ninja \
        -DCMAKE_INSTALL_PREFIX=${GCC_LLVM_INSTALL_PATH} \
        -DLLVM_INSTALL_TOOLCHAIN_ONLY=ON \
        -DLLVM_ENABLE_PROJECTS="clang;lld" \
        -DLLVM_ENABLE_RUNTIMES="compiler-rt;libunwind;libcxxabi;libcxx" \
        -DBUILTINS_CMAKE_ARGS="-DLLVM_ENABLE_PER_TARGET_RUNTIME_DIR=OFF" \
        -DRUNTIMES_CMAKE_ARGS="-DLLVM_ENABLE_PER_TARGET_RUNTIME_DIR=OFF" \
        -DLLVM_PARALLEL_LINK_JOBS=4 \
        -DLLVM_ENABLE_BINDINGS=OFF \
        -DLLVM_ENABLE_ZLIB=YES \
        -DCOMPILER_RT_BUILD_BUILTINS=ON \
        -DCOMPILER_RT_BUILD_CRT=ON \
        -DCOMPILER_RT_BUILD_SANITIZERS=OFF \
        -DCOMPILER_RT_BUILD_XRAY=OFF \
        -DCOMPILER_RT_BUILD_LIBFUZZER=OFF \
        -DCOMPILER_RT_BUILD_PROFILE=OFF \
        -DCOMPILER_RT_BUILD_MEMPROF=OFF \
        -DCOMPILER_RT_BUILD_ORC=OFF \
        -DCOMPILER_RT_USE_BUILTINS_LIBRARY=ON \
        -DCOMPILER_RT_DEFAULT_TARGET_ONLY=ON \
        -DLIBUNWIND_USE_COMPILER_RT=ON \
        -DLIBCXXABI_USE_COMPILER_RT=ON \
        -DLIBCXXABI_USE_LLVM_UNWINDER=ON \
        -DLIBCXX_HAS_MUSL_LIBC=ON \
        -DLIBCXX_USE_COMPILER_RT=ON \
        -DCLANG_DEFAULT_RTLIB=compiler-rt \
        -DCLANG_DEFAULT_LINKER=lld \
        -DLLVM_DEFAULT_TARGET_TRIPLE=x86_64-alpine-linux-musl \
        -DLLVM_TARGETS_TO_BUILD="Native" \
    && cmake --build ./build --target install \
    && rm -rf build \
    && mkdir -p ${INSTALL_PREFIX}/lib ${INSTALL_PREFIX}/bin ${INSTALL_PREFIX}/include \
    && ln -s ${GCC_LLVM_INSTALL_PATH}/bin/*       ${INSTALL_PREFIX}/bin/ \
    && ln -s ${GCC_LLVM_INSTALL_PATH}/lib/*       ${INSTALL_PREFIX}/lib/ \
    && ln -s ${GCC_LLVM_INSTALL_PATH}/include/c++ ${INSTALL_PREFIX}/include/

# TODO build zlib with llvm toolchain

# build and link clang+lld with llvm toolchain
# NOTE link jobs with LTO can use more than 10GB each!
# NOTE execinfo.h not available on musl -> lldb and compiler-rt:fuzzer/sanitizer/profiler cannot be built!
ARG LLVM_INSTALL_PATH
ARG LDFLAGS="-rtlib=compiler-rt -unwindlib=libunwind -stdlib=libc++ -L/usr/local/lib -Wno-unused-command-line-argument"
RUN cd ${LLVM_SRC_DIR}/ \
    && cmake -B./build -H./llvm -DCMAKE_BUILD_TYPE=MinSizeRel -G Ninja \
        -DCMAKE_C_COMPILER=clang \
        -DCMAKE_CXX_COMPILER=clang++ \
        -DLLVM_USE_LINKER=lld \
        -DCMAKE_SHARED_LINKER_FLAGS="${LDFLAGS}" \
        -DCMAKE_MODULE_LINKER_FLAGS="${LDFLAGS}" \
        -DCMAKE_EXE_LINKER_FLAGS="${LDFLAGS}" \
        -DCMAKE_INSTALL_PREFIX=${LLVM_INSTALL_PATH} \
        -DLLVM_INSTALL_TOOLCHAIN_ONLY=ON \
        -DLLVM_ENABLE_PROJECTS="clang;lld" \
        -DLLVM_ENABLE_RUNTIMES="compiler-rt;libunwind;libcxxabi;libcxx" \
        -DBUILTINS_CMAKE_ARGS="-DLLVM_ENABLE_PER_TARGET_RUNTIME_DIR=OFF;-DCMAKE_SHARED_LINKER_FLAGS='${LDFLAGS}';-DCMAKE_MODULE_LINKER_FLAGS='${LDFLAGS}';-DCMAKE_EXE_LINKER_FLAGS='${LDFLAGS}'" \
        -DRUNTIMES_CMAKE_ARGS="-DLLVM_ENABLE_PER_TARGET_RUNTIME_DIR=OFF;-DCMAKE_SHARED_LINKER_FLAGS='${LDFLAGS}';-DCMAKE_MODULE_LINKER_FLAGS='${LDFLAGS}';-DCMAKE_EXE_LINKER_FLAGS='${LDFLAGS}'" \
        -DLLVM_PARALLEL_LINK_JOBS=2 \
        -DLLVM_ENABLE_LTO=ON \
        -DLLVM_ENABLE_LIBCXX=ON \
        -DLLVM_ENABLE_BINDINGS=OFF \
        -DLLVM_ENABLE_EH=ON \
        -DLLVM_ENABLE_RTTI=ON \
        -DLLVM_ENABLE_ZLIB=ON \
        -DCOMPILER_RT_BUILD_BUILTINS=ON \
        -DCOMPILER_RT_BUILD_CRT=ON \
        -DCOMPILER_RT_BUILD_SANITIZERS=OFF \
        -DCOMPILER_RT_BUILD_XRAY=OFF \
        -DCOMPILER_RT_BUILD_LIBFUZZER=OFF \
        -DCOMPILER_RT_BUILD_PROFILE=OFF \
        -DCOMPILER_RT_BUILD_MEMPROF=OFF \
        -DCOMPILER_RT_BUILD_ORC=OFF \
        -DCOMPILER_RT_USE_BUILTINS_LIBRARY=ON \
        -DCOMPILER_RT_DEFAULT_TARGET_ONLY=ON \
        -DLIBUNWIND_USE_COMPILER_RT=ON \
        -DLIBCXXABI_USE_COMPILER_RT=ON \
        -DLIBCXXABI_USE_LLVM_UNWINDER=ON \
        -DLIBCXX_HAS_MUSL_LIBC=ON \
        -DLIBCXX_USE_COMPILER_RT=ON \
        -DCLANG_DEFAULT_LINKER=lld \
        -DCLANG_DEFAULT_RTLIB=compiler-rt \
        -DCLANG_DEFAULT_UNWINDLIB=libunwind \
        -DCLANG_DEFAULT_CXX_STDLIB=libc++ \
        -DLLVM_DEFAULT_TARGET_TRIPLE=x86_64-alpine-linux-musl  \
        -DLLVM_TARGETS_TO_BUILD="X86" \
        -DLLVM_DISTRIBUTION_COMPONENTS="clang;LTO;clang-format;clang-resource-headers;lld;builtins;runtimes" \
    && cmake --build ./build --target install-distribution \
    && rm -rf build


FROM alpine:${ALPINE_VERSION} AS clang-toolchain

ARG INSTALL_PREFIX
ARG LLVM_INSTALL_PATH

# assemble final image
COPY --from=builder ${LLVM_INSTALL_PATH} ${LLVM_INSTALL_PATH}
RUN mkdir -p ${INSTALL_PREFIX}/lib ${INSTALL_PREFIX}/bin ${INSTALL_PREFIX}/include \
    && ln -s ${LLVM_INSTALL_PATH}/bin/*       ${INSTALL_PREFIX}/bin/ \
    && ln -s ${LLVM_INSTALL_PATH}/lib/*       ${INSTALL_PREFIX}/lib/ \
    && ln -s ${LLVM_INSTALL_PATH}/include/c++ ${INSTALL_PREFIX}/include/
RUN apk add --no-cache binutils linux-headers musl-dev zlib

# set llvm toolchain as default
ENV CC=clang
RUN ln -s ${INSTALL_PREFIX}/bin/clang ${INSTALL_PREFIX}/bin/cc
ENV CXX=clang++
RUN ln -s ${INSTALL_PREFIX}/bin/clang++ ${INSTALL_PREFIX}/bin/c++
RUN ln -s ${INSTALL_PREFIX}/bin/lld ${INSTALL_PREFIX}/bin/ld
ENV CFLAGS=""
ENV CXXFLAGS="-stdlib=libc++"
ENV LDFLAGS="-rtlib=compiler-rt -unwindlib=libunwind -stdlib=libc++ -lc++ -lc++abi"

# add user mount point
RUN mkdir -p /project
WORKDIR /project 
```

### 下载

下载文件 (仅仅只存下载的 Source Code，通常会在 Source Code 的文件夹下 Build 文件。注意 Source Code 跟最后要安装的路径不一样) 。由于 LLVM 有一些公共文件会共用，必须整个下载，没有办法单独下载。但一般而言可以把历史版本抛弃。

```bash
git clone --depth=1 https://github.com/llvm/llvm-project.git
```

### 安装

![image-20220201155131404](https://raw.githubusercontent.com/haohua-li/photo-asset-repo/main/imgs/image-20220201155131404.png)

要装 clang, llvm, libcxx, compiler-rt, lld 都要一起装。system libraries 就是 Xcode Developer SDK 。

**注意一定要用 `Release`** , 否则会把 assertion 都编译进去，速度会非常慢。

- [Debug模式和Release模式有什么区别？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/443340911)
- `DLLVM_ENABLE_PROJECTS="clang;libcxx;libcxxabi;clang-tools-extra;compiler-rt"`

```bash
mkdir build && cd build

cmake ../llvm -G Ninja 
-DCMAKE_BUILD_TYPE="Release" -DLLVM_ENABLE_ASSERTIONS=ON \
-DLLVM_ENABLE_PROJECTS="clang" \
-DLLVM_INCLUDE_EXAMPLES="OFF" \
-DLLVM_INCLUDE_TESTS="OFF" \
-DLLVM_INCLUDE_BENCHMARKS="OFF" \
-DLLVM_TARGETS_TO_BUILD="X86" \
-DLLVM_USE_LINKER=lld \ 
-DLLVM_ENABLE_BINDINGS=Off \ 
-DLLVM_BUILD_DOCS=Off

# build (use all cores in the laptop)
# cmake --build . -j $(nproc)
ninja -j $(nproc)

# install (use cmake to install, since cmake will keep a record of installed files)
# https://gist.github.com/etaf/5f77158f1c45e90abfa3225f19f3c4bb
sudo cmake -P cmake_install.cmake

# uninstall 
sudo xargs rm -rf < install_manifest.txt
```

> 使用 **GNU ld** 作为 Linker 会爆内存，所以要预先装好 **lld** 或者 **ld.gold**  (即 `lld` 或者 `gold`)
>
> 如果内存比较大可以选择 `DCMAKE_BUILD_TYPE="Debug"` 

不用太担心 `.h` 文件的事情。`install` 命令会把需要的 binary 文件和 header 文件复制到 `-DCMAKE_INSTALL_PREFIX=""` 的。

注意如果需要 `clang` 的话需要把 `libcxx` 和 `libcxxabi` 也要一起带上，而且**最好指定安装目录**(如 `-DCMAKE_INSTALL_PREFIX=""`)，

比如 `clang12` 之类的。否则后期会与系统自带的 `clang` 冲突，导致无法找到 Xcode 的 system header files ，具体可以看看 [Clang 编译和安装的疑问? (haohua-li.github.io)](https://haohua-li.github.io/2022/01/26/clang.html) 。把 `/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX12.1.sdk` 作为 SDKROOT 就可以了。

具体参数的意义可以看  [Getting Started with the LLVM System — LLVM 13 documentation](https://llvm.org/docs/GettingStarted.html) 。其他参数

```bash
-DLLVM_TARGETS_TO_BUILD="host" \
-DLLVM_ENABLE_RTTI=OFF \
-DCMAKE_INSTALL_PREFIX=""   // 安装目的地(如果启用 clang 就需要指定)
```

如果下次发现还需要安装其他 subprojects,  稍微修改一下 `DLLVM_ENABLE_PROJECTS` 参数即可，然后再安装一次就可以了 (已生成的文件会自动跳过)。 

在安装完成以后，要看看是否全部正确安装正确 (其实不要搞特性，因为全部测一次要12小时)。

```bash
ninja check-all
```

还可以继续看看 Binary 文件是否都正确 (都在 `Build` 文件夹里面哦)。

```bash
./bin/clang-tidy --version
./bin/llvm-config --version 
./bin/opt --version 
```

在 `sudo ninja install` 以后，重启 Terminal 再看 `clang --version` 可以看到新版本的启用

![image-20220125181307178](https://raw.githubusercontent.com/haohua-li/photo-asset-repo/main/imgs/image-20220125181307178.png)

## 编写 LLVM Pass 

- [LLVM中的pass及其管理机制_大头蚂蚁的窝-CSDN博客_llvm pass](https://blog.csdn.net/mamamama811/article/details/110165333)
- [【LLVM】如何写一个pass - 简书 (jianshu.com)](https://www.jianshu.com/p/9f450969121b)
- [Writing an LLVM Pass — LLVM 13 documentation](https://llvm.org/docs/WritingAnLLVMPass.html)
- [如何让你的llvm pass跑起来 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/59875714)
-  [LLVM IR 的第一个 Pass：上手官方文档 Hello Pass - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/392381317)

写一个废的 Pass `FunctionInfo.cpp` 

```cpp
#include <llvm/IR/Module.h>
#include <llvm/Pass.h>
#include <llvm/Support/raw_ostream.h>

using namespace llvm;

namespace {

class FunctionInfo final : public ModulePass {
public:
  static char ID;

  FunctionInfo() : ModulePass(ID) {}

  // We don't modify the program, so we preserve all analysis.
  virtual void getAnalysisUsage(AnalysisUsage &AU) const override {
    AU.setPreservesAll();
  }

  virtual bool runOnModule(Module &M) override {
    outs() << "CSCD70 Function Information Pass"
           << "\n";

    /**
     * @todo(cscd70) Please complete this method.
     */

    return false;
  }
}; // class FunctionInfo

char FunctionInfo::ID = 0;
RegisterPass<FunctionInfo> X("function-info", "CSCD70: Function Information");

} // anonymous namespace
```

> ***Note***:
>
> 如果 Visual Studio Code 的 Intellisense 提示 `llvm/IR/Module.h` 等无法找到，请确保 C++ Plugin 的 CompilerPath 是 `/usr/bin/clang++` 。由于这个设置是保存在 `.vscode` 文件夹下，所以可能需要多次设置。

> ***注册 Pass:*** 
>
> 注册到 `RegisterPass` 之后就可以用 `opt` 指令来运行啦！

## 构建 LLVM Pass 

参考 [如何让你的llvm pass跑起来 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/59875714)

注意 Linux 和 macOS 的 `Makefile` 不一样。

一般情况下如下：

```makefile
all: hello.so

CXXFLAGS = -rdynamic $(shell llvm-config --cxxflags) -g -O0

%.so: %.o 
	$(CXX) -dylib -shared $^ -o $@

clean:
	rm -f *.o *~ *.so

.PHONY: clean all
```

**但对于 macOS 要在链接阶段使用 `-dynamiclib -undefined dynamic_lookup` (不是 `-shared`)**

然后就用一个 `so` 的动态库生成了。

接下来就可以用这个 LLVM Pass 对程序进行分析了。

先写一个小程序，例子是 CSCD70 的。

关于 **C 语言可变参数的用法**可以看 Mudong 大佬 [深入C语言可变参数(va_arg,va_list,va_start,va_end) (mudongliang.github.io)](https://mudongliang.github.io/2017/02/20/cva_argva_listva_startva_end.html)

(即 `va_list` 等等，但此处不是重点)。

```cpp
//      Compile the test case into assembly.
// RUN: clang -O2 -S -emit-llvm -c %s -o %basename_t.ll
//      Run the FunctionInfo pass. The `-disable-output` option disables
//      outputing the bytecode because we are only checking the pass outputs here.
// RUN: opt -load %dylibdir/libFunctionInfo.so -function-info -disable-output 2>&1 %basename_t.ll | \
//      Check the output "CSCD70 Function Information Pass".
// RUN: FileCheck --match-full-lines --check-prefix=SAMPLE %s
/**
 * @todo(cscd70) Please remove the `--check-prefix=SAMPLE` option.
 */
// SAMPLE: CSCD70 Function Information Pass

int g;
// CHECK-LABEL: Function Name: g_incr
// CHECK-NEXT: Number of Arguments: 1
// CHECK-NEXT: Number of Calls: 0
// CHECK-NEXT: Number OF BBs: 1
// CHECK-NEXT: Number of Instructions: 4
int g_incr(int c) {
  g += c;
  return g;
}

// CHECK-LABEL: Function Name: loop
// CHECK-NEXT: Number of Arguments: 3
// CHECK-NEXT: Number of Calls: 0
// CHECK-NEXT: Number OF BBs: 3
// CHECK-NEXT: Number of Instructions: 10
int loop(int a, int b, int c) {
  int i, ret = 0;
  for (i = a; i < b; i++) {
    g_incr(c);
  }
  return ret + g;
}
```

### Clang Compiling  

如何编译也很有学问。可以参考 <https://github.com/banach-space/llvm-tutor#overview-of-the-passes>

里面介绍了各种参数的意思。然后可以把 `.c` 语言编译为 bytecode (其中 `-O2` 是采取优化，)

```bash
clang -O1 -emit-llvm ./test/Loop.c -c -o ./test/Loop.bc
```

> ***Note***:
>
> 如果运行时说 `-emit-llvm` 不能在链接的时候使用，不要慌张。
>
> https://github.com/banach-space/llvm-tutor#overview-of-the-passes

注意 `Loop.bc` 可以被转译为 LLVM IR ，下面的命令仅是为了好玩，在实际中不一定需要。

```bash
llvm-dis ./test/Loop.bc -o=./test/Loop.ll
```

把 Bytecode 作为输入，传入到 pass `FunctionInfo` (即 `opt` 命令)

```bash
opt -load ./FunctionInfo.so -function-info ./test/Loop.bc -o ./test/LoopOpt.bc
```

> ***Note*** : 
> the use of **flag** `-function-info` to enable this pass (可以看到是在 `FunctionInfo.cpp` 文件里面).

到了这里还有可能出错 (提示 `unknown pass name`)，这是因为 LLVM 换了新的 Pass Manager 了。

具体解决方法可以看 [LLVM IR 的第一个 Pass：上手官方文档 Hello Pass - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/392381317)

### Pass Option 

按照步骤，输入 ` opt -load FunctionInfo.so -help`  可以看到确实有 `-function-info` 的选项。

![image-20220119190051720](https://raw.githubusercontent.com/haohua-li/photo-asset-repo/main/imgs/image-20220119190051720.png)

所以是加载上了。

> **其实**，**官方文档中说了**，**是在最一开始的[介绍](https://link.zhihu.com/?target=https%3A//llvm.org/docs/WritingAnLLVMPass.html%23introduction-what-is-a-pass)中就提到了**，**而且这部分还用红色的 warning 框**，**警示出来了**。只是看过很多，忘了最初的内容。如果想使用 opt 工具中旧的 Pass 管理器（the legacy pass manager），请添加 `-enable-new-pm=0` 选项。

```bash
opt -load ./FunctionInfo.so -function-info ./test/Loop.bc -o ./test/LoopOpt.bc -enable-new-pm=0
```

千辛万苦终于出来了

![image-20220119190437175](https://raw.githubusercontent.com/haohua-li/photo-asset-repo/main/imgs/image-20220119190437175.png)

如果被处理过的 ByteCode 不太重要，可以丢弃给 `/dev/null`

```bash
opt -load ./build/HelloWorld/libLLVMHello.so -hello ./test/output/a_plus_b_simple_addition.bc -o /dev/null -enable-new-pm=0 
```

其中 `<>` 符号是 BNF 语法中常见内容，里面填入文件名即可。

### Pass 运行时间

可以查看 Pass 运行了多久。

```bash
opt -load ./build/HelloWorld/libLLVMHello.so -hello ./test/output/a_plus_b_simple_addition.bc -o /dev/null -enable-new-pm=0 -time-passes
```

其中 Module Verifer 是保证在你的 Pass 之后，程序不会崩溃 ? (不清楚)

```
===-------------------------------------------------------------------------===
                      ... Pass execution timing report ...
===-------------------------------------------------------------------------===
  Total Execution Time: 0.0002 seconds (0.0003 wall clock)

   ---User Time---   --System Time--   --User+System--   ---Wall Time---  ---Instr---  --- Name ---
   0.0002 ( 91.5%)   0.0001 ( 86.3%)   0.0002 ( 90.0%)   0.0002 ( 89.6%)     707635  Bitcode Writer
   0.0000 (  7.4%)   0.0000 (  4.1%)   0.0000 (  6.4%)   0.0000 (  6.5%)      87150  Module Verifier
   0.0000 (  1.1%)   0.0000 (  9.6%)   0.0000 (  3.6%)   0.0000 (  4.0%)      51135  Hello World Pass
   0.0002 (100.0%)   0.0001 (100.0%)   0.0002 (100.0%)   0.0003 (100.0%)     845920  Total

===-------------------------------------------------------------------------===
                                LLVM IR Parsing
===-------------------------------------------------------------------------===
  Total Execution Time: 0.0004 seconds (0.0004 wall clock)

   ---User Time---   --System Time--   --User+System--   ---Wall Time---  ---Instr---  --- Name ---
   0.0003 (100.0%)   0.0001 (100.0%)   0.0004 (100.0%)   0.0004 (100.0%)    1151829  Parse IR
   0.0003 (100.0%)   0.0001 (100.0%)   0.0004 (100.0%)   0.0004 (100.0%)    1151829  Total
```

### 查看优化结果

由于 Pass 处理过的输出是 ByteCode， 根本看不懂。

- (1) 可以把 ByteCode 进行翻译到 IR 
- (2) 使用 `-print-after-all` 打印出 IR 的变化 (推荐，因为不用全部对比)

```
Hello: *** IR Dump After Hello World Pass (hello) ***
; Function Attrs: noinline nounwind optnone ssp uwtable
define i32 @_Z3addv() #0 {
  %1 = alloca i32, align 4
  store i32 0, i32* %1, align 4
  ret i32 0
}

*** IR Dump After Module Verifier (verify) ***
; Function Attrs: noinline nounwind optnone ssp uwtable
define i32 @_Z3addv() #0 {
  %1 = alloca i32, align 4
  store i32 0, i32* %1, align 4
  ret i32 0
}
```

