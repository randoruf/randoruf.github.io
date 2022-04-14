---
layout: post
title: "C++函数式编程 ： std::partial_sum"
date: 2021-09-10
tags: [cpp,functional_programming]
---



C++ `<numeric>` 的 `std::partial_sum` 有 bug 。

里面认为第一个 `sum` 应该是 `InputIterator` 的类型 (为什么不是 `OutputIterator` 类型啊？)。

所以 `std::partial_sum` 很有可能会有 Overflow 。

暂时我不知道怎么解决。

所以尽量别用了，希望能够尽快解决。



