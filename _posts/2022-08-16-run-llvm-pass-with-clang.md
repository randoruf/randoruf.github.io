---
layout: post
title: 'Clang 运行 LLVM Pass'
date: 2022-08-16
tags: [llvm]
---

* TOC 
{:toc}

---

## LLVM Out-of-Tree IR Pass 

可以看一看 
* [LLVM for Grad Students - by Adrian Sampson](https://www.cs.cornell.edu/~asampson/blog/llvm.html)
* [sampsyo - llvm-pass-skeleton (github.com)](https://github.com/sampsyo/llvm-pass-skeleton)
* [Writing an LLVM Pass - by llvm.org](https://llvm.org/docs/WritingAnLLVMPass.html#basic-code-required)

也可以参考这个 

<https://github.com/randoruf/cs-nano-projects/tree/main/llvm101/llvm-skeleton-pass>

### Run LLVM Pass with Opt

可以看 <https://github.com/randoruf/cs-nano-projects/blob/main/llvm101/llvm-skeleton-pass/lib/HelloWorldNormal.cpp.bak>

```cpp
char HelloWorldPass::ID = 0;
static RegisterPass<HelloWorldPass>
    X("legacy-hello-world", "Hello World Pass",
      false /* Only looks at CFG */, 
      false /* Analysis Pass */);
```
获得 `.ll` 文件
```bash 
clang -S -emit-llvm bar.c 
```
运行 pass 
```bash
opt -enable-new-pm=0 -load libHelloWorldPass.dylib -legacy-hello-world -disable-output bar.ll 
```

### Add Pass to Pipeline 
可以看 ***Learn LLVM 12: A beginner's guide to learning LLVM compiler tools and core libraries with C++*** 的 第八章。

明白到用 Clang 运行 Pass 的本质就是 ***把 Pass 注册到你的编译器上*** ，因为你正在尝试构建一个动态加载的编译器。如果直接搜索 Pipelien 大概率是找不到的。





### Run LLVM Pass with Clang 

<https://www.cs.cornell.edu/~asampson/blog/clangpass.html>

由于 Clang 不接收 Opt 的参数，所以如果想用 Clang 直接运行 Pass 需要把 Pass 注册到标准流水线 (standard pipeline) 
```cpp
char HelloWorldPass::ID = 0;
static RegisterPass<HelloWorldPass> 
   X("legacy-hello-world", "Hello World Pass",
      false /* Only looks at CFG */,
      false /* Analysis Pass */);

static RegisterStandardPasses Y(
    PassManagerBuilder::EP_EarlyAsPossible,
    [](const PassManagerBuilder &Builder,
       legacy::PassManagerBase &PM) { 
         PM.add(new HelloWorldPass()); 
   });
```

以后主要载入这个 library 就可以自动运行 Pass 了。

```bash 
clang -flegacy-pass-manager -Xclang -load -Xclang libHelloWorldPass.so bar.c 
```

## 使用 New Pass Manager 

### 查看 Pass Manager 

这里暂时不涉及 Compiler/Driver 部分，只涉及到 **Plugin** 。

如果是使用 legacy pass manager 
```bash 
opt hello.ll -enable-new-pm=0 -debug-pass=Structure -disable-output
```
如果是使用 new pass manager 
```
opt hello.ll -disable-output -debug-pass-manager
```
可以看到 [llvm::VerifierAnalysis](https://llvm.org/doxygen/structllvm_1_1VerifierAnalysis_1_1Result.html) 的源码在 `"llvm/IR/Verifier.h"`

> All LLVM passes inherit from the CRTP mix-in `PassInfoMixin<PassT>`.

这里出现了 Concept-based Polymorphism 的概念，涉及到 Mix-in Class 和 CRTP 。New Pass Manager 会分开 Anlyses 和 Passes， 由不同的 Pass Manager 负责。 还有 Pass 之间的转换要显著地使用 Adaptor (不懂是什么)。 

可见 LLVM New PM 用了很多**设计模式**的知识。

如果是用 pass 参数的注册比较简单, 比如如下命令

### 使用 passes flags  

```bash 
opt --load-pass-plugin=libHelloWorld.{dylib|so} --passes="hello-world" --disable-output
```

> FIXME: 
> (待认证) 实际上可以用 `-mllvm --passes="hello-world"` 或者 `-fpasses=hello-world` 之类的把参数从 clang 传递到 llvm 。所以应该可以避免注册到流水线的。

其注册代码可以是 
```cpp 
llvm::PassPluginLibraryInfo getHellWorldPluginInfo() {
  return {LLVM_PLUGIN_API_VERSION, "hello-world", LLVM_VERSION_STRING,
          [](PassBuilder &PB) {
            PB.registerPipelineParsingCallback(
                [](StringRef Name, FunctionPassManager &FPM,
                   ArrayRef<PassBuilder::PipelineElement>) {
                  if (Name == "hello-world") {
                    FPM.addPass(HelloWorldPass());
                    return true;
                  }
                  return false;
                });
          }};
}

extern "C" LLVM_ATTRIBUTE_WEAK ::llvm::PassPluginLibraryInfo
llvmGetPassPluginInfo() {
  return getHellWorldPluginInfo();
}
```

> 提示: 
> 在 ***Learn LLVM 12*** - Chapter 8 可以看到详细的意思。这里都是用 Lambda 创建 Callback Function, 目的是等真正的 PassBuilder 可以在创建后才执行其 construtor (也就是真正动态地添加和删除 pass)  

### 注册到流水线 / Extension Point of Pipeline
我们还可以插入到 ***Extension Point***, 也就是插入到标准流程的一环。

这部分可以看 
* <https://github.com/banach-space/llvm-tutor/blob/main/lib/OpcodeCounter.cpp>
* <https://github.com/banach-space/llvm-tutor/blob/main/HelloWorld/HelloWorld.cpp>

* llvm NewPassManager API分析及适配方案 <https://bbs.pediy.com/thread-272821.htm>


| 回调函数                                      | 回调时提供的对象    | 对应 ExtensionPointTy        |
| --------------------------------------------- | ------------------- | ---------------------------- |
| registerPeepholeEPCallback                    | FunctionPassManager | 对应EP_Peephole              |
| registerLateLoopOptimizationsEPCallback       | LoopPassManager     | 对应EP_LoopOptimizerEnd      |
| registerLoopOptimizerEndEPCallback            | LoopPassManager     | 对应EP_LateLoopOptimizations |
| registerScalarOptimizerLateEPCallback         | FunctionPassManager | 对应 EP_ScalarOptimizerLate  |
| registerCGSCCOptimizerLateEPCallback          | CGSCCPassManager    | 对应EP_CGSCCOptimizerLate    |
| registerVectorizerStartEPCallback             | FunctionPassManager | 对应EP_VectorizerStart       |
| registerPipelineStartEPCallback               | ModulePassManager   | 对应EP_EarlyAsPossible       |
| registerPipelineEarlySimplificationEPCallback | ModulePassManager   | 对应 EP_ModuleOptimizerEarly |
| registerOptimizerLastEPCallback               | ModulePassManager   | 对应EP_OptimizerLast         |




```cpp
namespace {
struct HelloWorld : PassInfoMixin<HelloWorld> {
  PreservedAnalyses run(Function &F, FunctionAnalysisManager &) {
    errs() << "(llvm-tutor) Hello from: "<< F.getName() << "\n";
    errs() << "(llvm-tutor)   number of arguments: " << F.arg_size() << "\n";
    return PreservedAnalyses::all();
  }
  // Without isRequired returning true, this pass will be skipped for functions decorated with the optnone LLVM attribute. Note that clang -O0 decorates all functions with optnone.
  static bool isRequired() { return true; }
};
} // namespace
```

#### Legacy Pass Manager

如果是使用 Legacy Pass Manager 比较简单 (注意需要**继承**，这里没有展示 Legacy Pass 的实现代码)

##### 参数启动

使用参数 `legacy-hello-world`

```cpp
char LegacyHelloWorld::ID = 0;
static RegisterPass<LegacyHelloWorld>
    X("legacy-hello-world", "Hello World Pass",
      true, // This pass doesn't modify the CFG => true
      false // This pass is not a pure analysis pass => false
    );
```

在 Terminal 启动, 

```bash
opt -enable-new-pm=0 -load libHelloWorld.dylib -legacy-hello-world -disable-output <input-llvm-file>
```

##### 自动启动
> 提示1: 
> 必须显式地指明优化级别(如 `-O{0|1|2|3}` 等)，
> 否则 `opt` 将会在没有运行任何 Pass 的情况下 **直接结束**。 ***不会尝试去构建 Pipeline***
```cpp
char LegacyOpcodeCounter::ID = 0;
// Register LegacyOpcodeCounter as a step of an existing pipeline, which means that LegacyOpcodeCounter will be run automatically at '-O{0|1|2|3}'.
// The Extension Point is set to 'EP_EarlyAsPossible'
static llvm::RegisterStandardPasses RegisterOpcodeCounter
   (llvm::PassManagerBuilder::EP_EarlyAsPossible,
      [](const llvm::PassManagerBuilder &Builder,
               llvm::legacy::PassManagerBase &PM) 
            {PM.add(new HelloWorld());});
```

在 Terminal 启动

```bash
# opt -O0 -enable-new-pm=0 -load libHelloWorld.dylib -disable-output <input-llvm-file>
clang -flegacy-pass-manager -Xclang -load -Xclang libHelloWorldPass.dylib <input-c-file>
```

#### New Pass Manager 

##### 参数启动
使用参数 `"hello-world"`

```cpp
llvm::PassPluginLibraryInfo getHelloWorldPluginInfo() {
  return {LLVM_PLUGIN_API_VERSION, "HelloWorld", LLVM_VERSION_STRING,
          [](PassBuilder &PB) {
            PB.registerPipelineParsingCallback(
                [](StringRef Name, FunctionPassManager &FPM,
                   ArrayRef<PassBuilder::PipelineElement>) {
                  if (Name == "hello-world") {
                    FPM.addPass(HelloWorld());
                    return true;
                  }
                  return false;
                });
          }};
}

extern "C" LLVM_ATTRIBUTE_WEAK ::llvm::PassPluginLibraryInfo
llvmGetPassPluginInfo() {
  return getHelloWorldPluginInfo();
}
```

在 Terminal 启动,

```bash
opt -load-pass-plugin=libHelloWorld.dylib  -passes="hello-world"  --disable-output  <input-llvm-file>
```

##### 自动启动

> 提示1: 
> 必须显式地指明优化级别(如 `-O{0|1|2|3}` 等)，
> 否则 `opt` 将会在没有运行任何 Pass 的情况下 **直接结束**。 ***不会尝试去构建 Pipeline***

> 提示2: 
> 由于我们的 HelloWorld 是 **Function Pass**, 但是 `PassBuilder::registerPipelineStartEPCallback` 的接口是要求 Module Pass 的。所以这里需要 adapator `createModuleToFunctionPassAdaptor` 进行 explicit conversion。

> 提示3: 
> `OptimizationLevel` 也允许我们对输入的优化级别进行判断。
> 如果这个不用，可对 `-O{0|1|2|3}` 全部都用


```cpp
llvm::PassPluginLibraryInfo getHelloWorldPluginInfo() {
  return {LLVM_PLUGIN_API_VERSION, "HelloWorld", LLVM_VERSION_STRING,
          [](PassBuilder &PB) {
            PB.registerPipelineStartEPCallback(
              [&](llvm::ModulePassManager &MPM, llvm::OptimizationLevel Level) {
                MPM.addPass(createModuleToFunctionPassAdaptor(HelloWorld()));
              }
            );
          }};
}

extern "C" LLVM_ATTRIBUTE_WEAK ::llvm::PassPluginLibraryInfo
llvmGetPassPluginInfo() {
  return getHelloWorldPluginInfo();
}
```

在 Terminal 启动
(可以看 <https://stackoverflow.com/questions/54447985/how-to-automatically-register-and-load-modern-pass-in-clang>)


```bash
# opt -O0 -load-pass-plugin=libHelloWorld.dylib --disable-output <input-llvm-file>
clang -fpass-plugin=./libHelloWorld.dylib ../test.c
```


> 注意： 
> 可以发现使用 clang 是不需要提供优化级别的。
> 所以这里学到知识就是 `opt` 一定要跟 优化级别 `-O0` 一起使用。


### add Passes to Compiler/Driver Pipeline 

这部分主要涉及到 Optimization Level 。

如何拓展到 Compiler 可以看 
* [The New Pass Manager (blog.llvm.org)](https://blog.llvm.org/posts/2021-03-26-the-new-pass-manager/)
* [Using the New Pass Manager(llvm.org)](https://llvm.org/docs/NewPassManager.html)
* [Porting Burst to the New LLVM Pass Manager](https://www.duskborn.com/posts/llvm-new-pass-manager/)
* [Learn LLVM 12 - Chapter 8:Adding an optimization pipeline to your compiler](https://www.packtpub.com/product/learn-llvm-12/9781839213502)

## 参考资料
* [llvm NewPassManager API分析及适配方案(看雪论坛)](https://bbs.pediy.com/thread-272821.htm)
* 「llvm-dev」How to port symcc to clang/llvm-13? <https://groups.google.com/g/llvm-dev/c/e_4WobR9WP0>
* [Writing an LLVM Pass with New PM](https://llvm.org/docs/WritingAnLLVMNewPMPass.html)
* [Getting Started with LLVM Core Libraries](https://www.amazon.com/Getting-Started-LLVM-Core-Libraries/dp/1782166920)
* [Learn LLVM 12](https://github.com/PacktPublishing/Learn-LLVM-12)
* [Porting Burst to the New LLVM Pass Manager](https://www.duskborn.com/posts/llvm-new-pass-manager/)
* [LLVM for Grad Students - by Adrian Sampson](https://www.cs.cornell.edu/~asampson/blog/llvm.html)
* [Run an LLVM Pass Automatically with Clang - by Adrian Sampson](https://www.cs.cornell.edu/~asampson/blog/clangpass.html)
* [Writing an LLVM Pass - by llvm.org](https://llvm.org/docs/WritingAnLLVMPass.html#basic-code-required)
* [2019 LLVM Developers’ Meeting: A. Warzynski “Writing an LLVM Pass: 101”](https://www.youtube.com/watch?v=ar7cJl2aBuU)
* [2019 LLVM Developers’ Meeting: J. Paquette & F. Hahn “Getting Started With LLVM: Basics”](https://www.youtube.com/watch?v=3QQuhL-dSys)
* [sampsyo - llvm-pass-skeleton (github.com)](https://github.com/sampsyo/llvm-pass-skeleton)