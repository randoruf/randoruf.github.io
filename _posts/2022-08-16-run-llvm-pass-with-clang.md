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

<https://llvm.org/docs/WritingAnLLVMNewPMPass.html>

>  All LLVM passes inherit from the CRTP mix-in `PassInfoMixin<PassT>`.

这里出现了 Concept-based Polymorphism 的概念，涉及到 Mix-in Class 和 CRTP 。

New Pass Manager 会分开 Anlyses 和 Passes， 由不同的 Pass Manager 负责。 

还有 Pass 之间的转换要显著地使用 Adaptor (不懂是什么)。 

可见 LLVM New PM 用了很多**设计模式**的知识。

首先需要先明白有哪些 Pass Manager 

常见的 Analysis Pass Manager 

```cpp
LoopAnalysisManager LAM;
FunctionAnalysisManager FAM;
CGSCCAnalysisManager CGAM;
ModuleAnalysisManager MAM;
```

还有普通各种 level 的 Pass Manager 
```cpp
FunctionPassManager FPM;
FPM.addPass(InstSimplifyPass());  // InstSimplifyPass is a function pass
```
可以把 Function Pass 加入到 Moudle Pass (使用 **Adaptor**) 
```cpp
FunctionPassManager FPM;
FPM.addPass(InstSimplifyPass()); // InstSimplifyPass is a function pass

ModulePassManager MPM;
MPM.addPass(createModuleToFunctionPassAdaptor(std::move(FPM)));
```


## 参考资料
* [LLVM for Grad Students - by Adrian Sampson](https://www.cs.cornell.edu/~asampson/blog/llvm.html)
* [Run an LLVM Pass Automatically with Clang - by Adrian Sampson](https://www.cs.cornell.edu/~asampson/blog/clangpass.html)
* [Writing an LLVM Pass - by llvm.org](https://llvm.org/docs/WritingAnLLVMPass.html#basic-code-required)
* [2019 LLVM Developers’ Meeting: A. Warzynski “Writing an LLVM Pass: 101”](https://www.youtube.com/watch?v=ar7cJl2aBuU)
* [2019 LLVM Developers’ Meeting: J. Paquette & F. Hahn “Getting Started With LLVM: Basics”](https://www.youtube.com/watch?v=3QQuhL-dSys)
* [sampsyo - llvm-pass-skeleton (github.com)](https://github.com/sampsyo/llvm-pass-skeleton)