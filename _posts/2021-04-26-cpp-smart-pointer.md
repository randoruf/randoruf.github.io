---
layout: post
title: "C++ 智能指针语法"
date: 2021-04-26
---


* TOC
{:toc}
---

## 指针的声明

你可以直接初始化指针( 用 new 或者 make_shared)

```c++
#include <memory>
#include <iostream>

int main(){
    // auto integerPtr(new int(10));
    auto integerPtr(std::make_shared<int>(10));
     
    std::cout << (*integerPtr) << std::endl; 
}

```

也可以赋值初始化

```C++
auto integerPtr = std::make_shared<int>(10) ;
```

上一种写法比较少见。