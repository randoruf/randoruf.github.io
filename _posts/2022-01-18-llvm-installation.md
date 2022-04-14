---
layout: post
title: "LLVM安装"
date: 2022-01-18
tags: [llvm]
---

## 安装 LLVM 

小小记录一下 LLVM 的安装，主要参考 

- [Getting Started with the LLVM System — LLVM 13 documentation](https://llvm.org/docs/GettingStarted.html)
- [llvm-adventure/Build LLVM on macOS.md at master · appcypher/llvm-adventure (github.com)](https://github.com/appcypher/llvm-adventure/blob/master/Build LLVM on macOS.md)
- [Mac 编译 llvm / mlir - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/430469470)
- [LLVM 入门教程之基本介绍 - Yuuoniy's blog](https://blog.yuuoniy.cn/posts/llvm-1/)
- [Git clone仓库的一个子目录 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/54581830)
- [Building LLVM with CMake — LLVM 13 documentation](https://llvm.org/docs/CMake.html)
- 【书】Getting Started with LLVM Core Libraries
- 【书】LLVM12 

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

```bash
cd where-you-want-to-install 
mkdir build && cd build

cmake ../llvm -G Ninja -DCMAKE_BUILD_TYPE="Release" -DLLVM_ENABLE_PROJECTS="clang;libcxx;libcxxabi;clang-tools-extra;compiler-rt"

# build (use all cores in the laptop)
cmake --build . -j $(nproc)

# install (use cmake to install, since cmake will keep a record of installed files)
# https://gist.github.com/etaf/5f77158f1c45e90abfa3225f19f3c4bb
sudo cmake -P cmake_install.cmake

# uninstall 
sudo xargs rm -rf < install_manifest.txt
```

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

