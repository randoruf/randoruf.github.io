---
layout: post
title: "Visual Studio Code 的 Debugger "
date: 2021-07-21
tags: [cpp]
---





- 按照 [Configure VS Code for Clang/LLVM on macOS](https://code.visualstudio.com/docs/cpp/config-clang-mac) 配置 
- 教程有介绍 `tasks.json` 是 Compiler 的设置，会经常用到
  - 比如在 `tasks.json` 的 `args` 里面加上 `"-sdt=c++17"` 来指定 Compiler 的版本
  - 因为 Clang 默认好像是 C99 
- 改好后记得关系 `tasks.json`
- ***打开需要 Debug 的文件， 例如 `leetcode399.cpp`*** 
- 点击**左上角的三角形**， 就可以开始 Debug 
- 要 Debug 就一定要**打开源代码文件**， 
  - 我就犯了一个弱智错误，对着 `tasks.json` 点 Debug， 
  - 然后 Console 显示 `clang++ xxxx/tasks.json` 和 Compiler 找不到 `_main` 
  - `tasks.json` 当然没有了.....

![](/shared/imgs/image-20210721171237174.png)

