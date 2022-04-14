---
layout: post
title: "如何调试 C++ 程序 ?"
date: 2022-02-18
tags: [cs,compiler]
---

---

最近学了 LLVM 才知道 Sanitizer 。

总结了一下 CS225 中相关的知识。

可以看这里 [algorithms-data-structures-in-cpp/cs225-assignments/lab_memory at main · haohua-li/algorithms-data-structures-in-cpp (github.com)](https://github.com/haohua-li/algorithms-data-structures-in-cpp/tree/main/cs225-assignments/lab_memory)

主要总结就是 

- 调试 LLDB  https://github.com/haohua-li/algorithms-data-structures-in-cpp/tree/main/cs225-assignments/lab_memory#gdb-and-lldb-reference
- 内存错误 LLVM Sanitizer https://github.com/haohua-li/algorithms-data-structures-in-cpp/tree/main/cs225-assignments/lab_memory#dynamic-code-analysis
- 常见的内存错误 https://github.com/haohua-li/algorithms-data-structures-in-cpp/tree/main/cs225-assignments/lab_memory#appendix-a---common-memory-errors-and-leaks

其中比较有趣的是 `__LINE__` 代表当前代码行数。

```cpp
std::cout << __LINE__ << std::endl;  
```

在 Linux 上也可以构建 `clang`, `llvm`,`lldb` 系，所以不用去学 Valgrind 和 GDB 。 

VS Code 也有 GUI 的 LLDB 或者 GDB 的调试，现在已经轻松很多了。
