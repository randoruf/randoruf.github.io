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

Create symlink in your homedir

```c
mac:~ woz$ cd
mac:~ woz$ ln -s /usr/local/Cellar/boost/1.57.0 boost_1_57_0
mac:~ woz$ 
```

Inside Xcode refer to the just created symlink like this

![image-20210318105225694](/shared/imgs/image-20210318105225694.png)

For the `Header Search Paths` use `$(HOME)/boost_1_57_0/include`

For the `Library Search Paths` use `$(HOME)/boost_1_57_0/lib`