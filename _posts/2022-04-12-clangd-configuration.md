---
layout: post
title: "C++ IDE 搭建 - Clangd + VS Code 初体验"
date: 2022-04-12
tags: [cs, ide]
---

Visual Studio 虽然强大，但不是跨平台的，所以如果在 Linux 下开发就很麻烦。

而 Clion 要钱，不用考虑。

只能在 Visual Studio Code 加些插件，

### Package Manager 

Node.js 有 NPM

Haskell 有 Cabal  

Rust 有 Cargo 

C/C++ 当然也有 vcpkg 

> *vcpkg* is a free C/C++ *package manager* for acquiring and managing libraries. 

### CMake 

***Visual Studio Code 左边就有 CMake***，可以修改 CMakeCache.txt 

然后 <kbd>ctl</kbd> <kbd>shift</kbd> <kbd>p</kbd> 可以 CMake 的 Build, Debug 等等。

记得在 Visual Studio Code 的 ***CMake Tools Extension*** 关掉 

- Configure On Edit
- Configure On Open 

这两个选项会生成一个新的 CMakeCache.txt 覆盖掉你设置好的 CMake 参数，自作聪明的典范。

### Make = Ninja 

但实际不用学。直接学 CMake 就可以了，反正最后都是 

```bash
cmake .. 
ninja -j$(nproc)
```

### Clangd 

因为 Microsoft C++ Intellisense 是 Lazy 加载，用的时候才会计算，加载大项目的时候速度非常快，但后期写代码因为缓存是临时计算的，智能提示会十分慢。

而且 Clangd 采取类似 Clion 的策略，一开始就计算好所有缓存，刚开大项目的时候，发热严重，但是写代码的体验也跟 Clion 一样爽

可以换到 Clangd， 这个插件会直接调用 Clang 的库生成 AST ，而且效率也不错。就是刚开始上手会有点麻烦。

[Adding compile flags to Ycm clangd : vim (reddit.com)](https://www.reddit.com/r/vim/comments/lod4cq/adding_compile_flags_to_ycm_clangd/) 

有三种方法给 Clang Compiler Flags 传入参数 - [Configuration (llvm.org)](https://clangd.llvm.org/config)

- `compile_commands.json` 放到 parents of the source project 
- `compile_flags.txt` 放到 project directory
-  <kbd>ctl</kbd> <kbd>shift</kbd> <kbd>p</kbd> 搜索 `clangd:open user setting` 会打开 `config.yaml` 文件。

在 `config.yaml` 文件里面参数会**全局生效**。格式 如官网所写 [Configuration (llvm.org)](https://clangd.llvm.org/config#compileflags) 

```yaml
CompileFlags:                     # Tweak the parse settings
  Add: [-std=c++17, -xc++, -Wall]             # treat all files as C++, enable more warnings
  Remove: -W*                     # strip all other warning-related flags
  Compiler: clang++               # Change argv[0] of compile flags to `clang++`
```

不然会默认使用 C++ 不知道多少。

