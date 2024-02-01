---
layout: post
title: "C++ Lambda Function"
date: 2021-08-25T00:20:00Z
tags: [cpp]
---

* TOC 
{:toc}
---

主要是 `[=]` 和 `[&]` ， 可以看 **微软的 C++ 文档** 。

一切以微软 C++ 文档为准。

```cpp
#include <iostream>

using namespace std; 

int main(){
    int x = 10; 
    // Capture by Value 是不允许修改的
    // auto f1 = [x]() { return x = 42; }; 
    // auto f2 = [=]() { return x = 42; }; 
    auto f3 = [x]() mutable {return x = 42; }; 

    // Capture by Reference 
    // auto f1 = [&x]() { return x = 42; };
    // auto f2 = [&]()  { return x = 42; }; 

    std::cout << f3() << std::endl; 
}
```

