---
layout: post
title: "C++ all_of, any_of, none_of"
date: 2021-04-17
---



C++11 新增了 Haskell 的类似语句。

<https://hackage.haskell.org/package/base-4.15.0.0/docs/Data-List.html>

<img src="/shared/imgs/image-20210417121948014.png" alt="image-20210417121948014" style="zoom:50%;" />

如果你忘了 Foldable 是啥，看看 Tim 的笔记。类似 Iterator 。

<https://tgdwyer.github.io/haskell4/> 

- Foldabale , 可以通过 iterator 然后 `reduce` 成一个**单一值**
- Iterator, 基本和 Foldable 类似，但是 Iterator 功能更强大，不止弄成单一值。。。



用法看 

[std::all_of, std::any_of, std::none_of - cppreference.com](https://en.cppreference.com/w/cpp/algorithm/all_any_none_of)

