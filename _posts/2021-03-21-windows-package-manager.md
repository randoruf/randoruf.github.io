---
layout: post
title: "Windows Package Manager 包管理工具"
date: 2021-03-21T00:20:0Z
---





现在 Windows 也有类似 **brew** 和 **apt** 之类的包管理工具， 那就是 **choco**

[Chocolatey Software | Chocolatey - The package manager for Windows](https://chocolatey.org/)



如果你想安装 C++ 库也很方便。首先安装好 **vcpkg**, 把 vcpkg 加入到 system path 。然后让他连接 Visual Studio (先安装 Visual Studio).s

```bash
vcpkg integrate install
```

**vcpkg** (记得在**纯净的 powershell** 运行, 不要运行任何 x64 Native Build Tool Prompt 之类的 wrapper 命令行) 

可以把 include 和 lib 统统安装好， 并让 Visual Studio 自动找到。

[Setup SDL2 with VS2019 and vcpkg - DEV Community](https://dev.to/taowyoo/setup-sdl2-with-vs2019-and-vcpkg-32eg)

