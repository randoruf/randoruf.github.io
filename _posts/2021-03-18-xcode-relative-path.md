---
layout: post
title: "Xcode编译使用相对路径"
date: 2021-03-18T00:20:00Z
---



Xcode 默认把编程完成的文件放到一个我根本不知道地方。

所以运行的时候，是**无法使用相对路径访问项目下面的资源的**。

方法就是 

Product -> Schema -> ***Working Directory*** 选中你的项目。 