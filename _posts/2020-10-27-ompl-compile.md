---
layout: post
title: "OMPL 编译自己的代码"
date: 2020-10-26T00:20:00Z
tags: [motion_planning]
---



可以参考这个页面  <https://ompl.kavrakilab.org/buildSystem.html>



### 第一种方法重新运行 CMake 

来源 <https://zhuanlan.zhihu.com/p/112684841>

到 `~/ompl/demos/` 目录下 (ompl的安装目录) ， 并修改 `CmakeList.txt` ，在14行左右添加

```
add_ompl_demo(a.out ?????.cpp)
```

其中 a.out 为输出文件， ????.cpp 为新增加的源代码。 



### 第二种方法是 gcc 

需要 gcc 的 compile flag 和 link flag 。

```
g++ (Compile Flag) -o hello SE3RigidBodyPlanning.cpp (Link Flag)
```

我想编译一个叫 `SE3RigidBodyPlanning.cpp` 的文件， 输出为 `hello` 的可执行文件。 

运行  `pkg-config --cflags ompl` 查看 compile flag 

运行 `pkg-config --libs ompl` 查看 link flag 

一般输出结果会非常长， 没有关系全部复制粘贴。

```
g++ -I/usr/local/include/ompl-1.5 -I/usr/include/eigen3 -o hello SE3RigidBodyPlanning.cpp -L/usr/local/lib -L_link_dirs-NOTFOUND -lompl -lompl_app_base -lompl_app /usr/lib/x86_64-linux-gnu/libboost_serialization.so /usr/lib/x86_64-linux-gnu/libboost_filesystem.so /usr/lib/x86_64-linux-gnu/libboost_system.so -lpthread /usr/lib/x86_64-linux-gnu/libboost_program_options.so /usr/lib/x86_64-linux-gnu/libOpenGL.so /usr/lib/x86_64-linux-gnu/libGLX.so /usr/lib/x86_64-linux-gnu/libGLU.so -lode -lassimp -lfcl
```

然后可以无错编译了。 

