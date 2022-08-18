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

这部分可以看 <https://github.com/banach-space/llvm-tutor/blob/main/lib/OpcodeCounter.cpp>


```cpp
//------------------------------------------------------------------------------
// New PM interface
//------------------------------------------------------------------------------
using ResultOpcodeCounter = llvm::StringMap<unsigned>;

struct OpcodeCounter : public llvm::AnalysisInfoMixin<OpcodeCounter> {
  using Result = ResultOpcodeCounter;
  Result run(llvm::Function &F,
             llvm::FunctionAnalysisManager &);

  OpcodeCounter::Result generateOpcodeMap(llvm::Function &F);
  // Part of the official API:
  //  https://llvm.org/docs/WritingAnLLVMNewPMPass.html#required-passes
  static bool isRequired() { return true; }

private:
  // A special type used by analysis passes to provide an address that
  // identifies that particular analysis pass type.
  static llvm::AnalysisKey Key;
  friend struct llvm::AnalysisInfoMixin<OpcodeCounter>;
};

//------------------------------------------------------------------------------
// New PM interface for the printer pass
//------------------------------------------------------------------------------
class OpcodeCounterPrinter : public llvm::PassInfoMixin<OpcodeCounterPrinter> {
public:
  explicit OpcodeCounterPrinter(llvm::raw_ostream &OutS) : OS(OutS) {}

  llvm::PreservedAnalyses run(llvm::Function &Func,
                              llvm::FunctionAnalysisManager &FAM);
  // Part of the official API:
  //  https://llvm.org/docs/WritingAnLLVMNewPMPass.html#required-passes
  static bool isRequired() { return true; }

private:
  llvm::raw_ostream &OS;
};


```

如果是使用 Legacy Pass Manager 比较简单

```cpp
char LegacyOpcodeCounter::ID = 0;
// Register LegacyOpcodeCounter as a step of an existing pipeline, which means that LegacyOpcodeCounter will be run automatically at '-O{0|1|2|3}'.
// The Extension Point is set to 'EP_EarlyAsPossible'
static llvm::RegisterStandardPasses RegisterOpcodeCounter
   (llvm::PassManagerBuilder::EP_EarlyAsPossible,
      [](const llvm::PassManagerBuilder &Builder,
               llvm::legacy::PassManagerBase &PM) 
            {PM.add(new LegacyOpcodeCounter());});
```

如果是使用 New Pass Manager, 
(一个 输出 Pass Printer 和 一个 Analysis Pass)

> 提示: 
> 由于我们的 OpcodeCounter 是 **Function Pass**, 但是 `PassBuilder::registerPipelineStartEPCallback` 的接口是要求 Module Pass 的。所以这里需要 adapator `createModuleToFunctionPassAdaptor` 进行 explicit conversion。
> 此处稍微有点复杂，可以看一看原版的 [pcodeCounter.cpp](https://github.com/banach-space/llvm-tutor/blob/main/lib/OpcodeCounter.cpp)，他用的是 `registerVectorizerStartEPCallback` 。也可以看 Learn 12 Chapter 也有详细说明。




```cpp
llvm::PassPluginLibraryInfo getOpcodeCounterPluginInfo() {
  return {
    LLVM_PLUGIN_API_VERSION, "OpcodeCounter", LLVM_VERSION_STRING,
        [](PassBuilder &PB) {
          // Register OpcodeCounterPrinter as a step of an existing pipeline. It adds our CountIRPass Pass to the beginning of the pipeline (i.e. when using '-O{0|1|2|3|s}') .
          PB.registerPipelineStartEPCallback(
              [](ModulePassManager &MPM) {
                MPM.addPass(
                  createModuleToFunctionPassAdaptor(
                     OpcodeCounterPrinter(llvm::errs())
                  )
               );
              });
          // #3 REGISTRATION FOR "FAM.getResult<OpcodeCounter>(Func)"
          // Register OpcodeCounter as an analysis pass. This is required so that OpcodeCounterPrinter (or any other pass) can request the results of OpcodeCounter.
          PB.registerAnalysisRegistrationCallback(
              [](FunctionAnalysisManager &FAM) {
                FAM.registerPass([&] { return OpcodeCounter(); });
              });
          }
        };
}

extern "C" LLVM_ATTRIBUTE_WEAK ::llvm::PassPluginLibraryInfo
llvmGetPassPluginInfo() {
  return getOpcodeCounterPluginInfo();
}
```



### add Passes to Compiler/Driver Pipeline 

这部分主要涉及到 Optimization Level 。

如何拓展到 Compiler 可以看 
* [The New Pass Manager (blog.llvm.org)](https://blog.llvm.org/posts/2021-03-26-the-new-pass-manager/)
* [Using the New Pass Manager(llvm.org)](https://llvm.org/docs/NewPassManager.html)
* [Porting Burst to the New LLVM Pass Manager](https://www.duskborn.com/posts/llvm-new-pass-manager/)
* [Learn LLVM 12 - Chapter 8:Adding an optimization pipeline to your compiler](https://www.packtpub.com/product/learn-llvm-12/9781839213502)

## 参考资料

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