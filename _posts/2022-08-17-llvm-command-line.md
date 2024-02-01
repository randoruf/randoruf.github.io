---
layout: post
title: 'LLVM命令行选项的使用'
date: 2022-08-17
tags: [llvm]
---

* TOC 
{:toc}

---

## CommandLine.h 的使用

<https://github.com/randoruf/cs-nano-projects/tree/main/llvm101/llvm-command-line>

```cpp
#include "llvm/IR/LegacyPassManager.h"
#include "llvm/Passes/PassBuilder.h"
#include "llvm/Passes/PassPlugin.h"
#include "llvm/Support/raw_ostream.h"

using namespace llvm;

static llvm::cl::list<std::string> strongbox_lists(
  "lists", llvm::cl::desc("Specify names"), llvm::cl::OneOrMore);


namespace {
struct HelloWorld : PassInfoMixin<HelloWorld> {
  PreservedAnalyses run(Function &F, FunctionAnalysisManager &) {
    errs() << "----------------------------------------------------\n"; 
    for(auto arg: strongbox_lists) {
      errs() << "(llvm-tutor-CLI) arg-lists: " << arg << "\n";
    }
    errs() << "----------------------------------------------------\n"; 
    errs() << "(llvm-tutor) Hello from: "<< F.getName() << "\n";
    errs() << "(llvm-tutor)   number of arguments: " << F.arg_size() << "\n";
    return PreservedAnalyses::all();
  }

  static bool isRequired() { return true; }
};
} 

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

如果需要使用**全局变量**可以看这里 <https://llvm.org/docs/CommandLine.html#internal-vs-external-storage>


然后 

```bash 
# opt -O0 -load build/libHelloWorld.dylib -load-pass-plugin=build/libHelloWorld.dylib -disable-output -lists ARG1 -lists ARG2 test.ll

clang -Xclang -load -Xclang build/libHelloWorld.dylib -mllvm -lists -mllvm ARG1 -mllvm -lists -mllvm ARG2 -fpass-plugin=build/libHelloWorld.dylib test.c
```


## OptTable.h 的使用

待续.... <https://zhuanlan.zhihu.com/p/261664746>


## 花絮
这个 Repository 里面有很多小例子。

<https://gitlab.itwm.fraunhofer.de/kai_plociennik/spu-llvm/-/tree/master/llvm/examples>

非常值得学习。如果关掉的话可以去有 2022年8月18日的备份。

<https://pan.baidu.com/s/1S3kqgqu1fIuidvytPhTIMQ>


## 参考资料
* [spu-llvm by Kai Plociennik](https://gitlab.itwm.fraunhofer.de/kai_plociennik/spu-llvm/-/tree/master/llvm/examples/Bye)
* [How to define and read CLI arguments for an LLVM Pass with the new Pass Manager?(stackoverflow.com)](https://stackoverflow.com/questions/67206238/how-to-define-and-read-cli-arguments-for-an-llvm-pass-with-the-new-pass-manager)
* [llvm - Pass arguments to a pass(stackoverflow.com)](https://stackoverflow.com/questions/48954209/llvm-pass-arguments-to-a-pass/48960669#48960669)
* [CommandLine 2.0 Library Manual](https://llvm.org/docs/CommandLine.html)
* [LLVM命令行选项的处理 - 宋方睿](https://zhuanlan.zhihu.com/p/261664746)
* [使用LLVM commmandLine库给程序和Pass添加命令行参数](https://blog.csdn.net/lifangyi01/article/details/124436117)