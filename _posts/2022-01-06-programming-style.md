---
layout: post
title: "从华为「方舟编译器」学习代码风格 (从反例中学习)"
date: 2022-01-06
tags: [compiler, cpp]
---

[程序员们如何看待华为方舟编译器首次开源部分代码？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/343494051/answer/809494133)

  ---   [bsdelf](https://www.zhihu.com/people/bsdelf) 

看下来至少有这些问题：

1. 存在未使用的变量
2. 乱用 move，很多应该要**避免拷贝**的地方反而不注意
3. 许多方法只有声明并无实现，链接会报错吧
4. MapleCombCompiler::Compile 方法内存泄漏
5. 其余是一些代码风格问题让我不爽（当然这就见仁见智了）
   1. h、cpp 目录分离
   2. 很少使用 const 变量
   3. 成员变量不使用下划线后缀或 m 前缀作区分
   4. 用 ifndef 做 include guard，而不是 `pragma once`
   5. 在 c++ 里写 typedef struct {...} Foobar

单论代码质量的话我打70分。

[编辑于 2019-09-01 02:10](https://www.zhihu.com/question/343494051/answer/809494133)
