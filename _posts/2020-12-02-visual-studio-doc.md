---
layout: post
title: "Run Visual Studio C++ compiler "
date: 2020-12-02T00:20:00Z
---

我上次就觉得 微软的 C#文档写得像教程一样。
整体风格跟我写的教程差不多。我十分喜欢。如果学会看的话，会收获非常多。

最近在看 **Cpp Primer** (希望能坚持下去)， 因为用 Macbook 不好装 Linux （最近苹果改了很多东西， 我觉得 Mac OS 现在比 Windows 还不适合开发，毕竟微软已经有 Linux Subsystem, vcpkg 等等各种奇葩东西， 最近甚至都有原生 ROS 了）

我发现了一个技巧， 就是原来  Visual Studio 的 build tools 也是可以直接从 command-line window 调用的。

可以看这篇文章 ： <https://docs.microsoft.com/en-us/cpp/build/walkthrough-compiling-a-native-cpp-program-on-the-command-line>


比如文件
```cpp
#include <iostream>
using namespace std;
int main()
{
    cout << "Hello, world, from Visual C++!" << endl;
}
```

可以尝试运行 `cl /EHsc hello.cpp` 
 
至于 EHsc 是什么可以在 微软的网站搜一搜。。。
