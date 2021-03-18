---
layout: post
title: "如何在 Xcode 添加外部的 Header 和 Libray"
date: 2021-03-18T00:20:00Z
---



### Include and Library for Project 

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



### Include and Library in the subdirectory 

还有一个常见的设置就是在 `Header Search Paths` 和 `Library Search Paths` 加上 `$(PROJECT_DIR)` 并选中 'recursive' 。

这样在子目录的代码文件都被加入。

![image-20210318121408522](/shared/imgs/image-20210318121408522.png)



### Include and Library for Target

某些特立独行的 Library 喜欢用动态库 `dylib` , 要注意到这是二进制文件。在 Porject 的 Building Setting 并不能成功 Linking 这些二进制库。 (就是说你 ， **ompl** 和 **boost**)

最常见的错误就是 **Linking Error**  ( 提示都是什么 ***symbol is undefined)***.

这时候就需要点 Target 

<img src="/shared/imgs/image-20210318112926298.png" alt="image-20210318112926298" style="zoom: 67%;" /> 	

右边可以看到 **Building Phase** , 在 ***Linking Binary with Libraries*** 就可以添加动态库了

(添加时你可能需要查看隐藏文件， 即 `command` + `Shift` + `.` )

![image-20210318113023449](/shared/imgs/image-20210318113023449.png)



下面给你看一看 boost 缺少 `dylib` 的常见状态：

![image-20210318113917505](/shared/imgs/image-20210318113917505.png)

千万别惊慌，这其实是 Linking 文件。适当配置即可解决。

方法就是添加 Boost 的动态库到 ***Linking Binary with Libraries*** 里面 (一个一个加真麻烦)

![image-20210318114129117](/shared/imgs/image-20210318114129117.png)

