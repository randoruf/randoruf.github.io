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



## 参考资料
* [LLVM for Grad Students - by Adrian Sampson](https://www.cs.cornell.edu/~asampson/blog/llvm.html)
* [Run an LLVM Pass Automatically with Clang - by Adrian Sampson](https://www.cs.cornell.edu/~asampson/blog/clangpass.html)
* [Writing an LLVM Pass - by llvm.org](https://llvm.org/docs/WritingAnLLVMPass.html#basic-code-required)
* [2019 LLVM Developers’ Meeting: A. Warzynski “Writing an LLVM Pass: 101”](https://www.youtube.com/watch?v=ar7cJl2aBuU)
* [2019 LLVM Developers’ Meeting: J. Paquette & F. Hahn “Getting Started With LLVM: Basics”](https://www.youtube.com/watch?v=3QQuhL-dSys)
* [sampsyo - llvm-pass-skeleton (github.com)](https://github.com/sampsyo/llvm-pass-skeleton)