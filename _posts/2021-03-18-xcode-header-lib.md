---
layout: post
title: "如何在 Xcode 添加外部的 Header 和 Libray"
date: 2021-03-18T00:20:00Z
---



[Include boost in xcode - Stack Overflow](https://stackoverflow.com/questions/10141983/include-boost-in-xcode/32673824#32673824)

I followed henrikstroem's great post, like this:

Install via [homebrew](http://brew.sh/), took less than 3 minutes

```c
mac:~ woz$ brew install boost
==> Downloading https://downloads.sf.net/project/machomebrew/Bottles/boost-1.57.0.yosemite.bottle.tar.gz
######################################################################## 100.0%
==> Pouring boost-1.57.0.yosemite.bottle.tar.gz
🍺  /usr/local/Cellar/boost/1.57.0: 10572 files, 439M
mac:~ woz$
```

然后查询这些库都被 brew 装到哪里了？

```
brew --prefix boost
```

显示 `/usr/local/opt/boost` 

可以打开以后把路径复制。然后点击蓝色的 Project 图标， 打开设置。

<img src="/shared/imgs/image-20210318110141537.png" alt="image-20210318110141537" style="zoom: 50%;" />

然后搜索 Header search path 和 Library search path 即可。把路径加入到设置中。

<img src="/shared/imgs/image-20210318110231597.png" alt="image-20210318110231597" style="zoom:50%;" />

![image-20210318105225694](/shared/imgs/image-20210318105225694.png)

For the `Header Search Paths` use `$(HOME)/boost_1_57_0/include`

For the `Library Search Paths` use `$(HOME)/boost_1_57_0/lib`



