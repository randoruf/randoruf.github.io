---
layout: post
title: "C++ volatile 关键字"
date: 2021-08-18
tags: [cpp]
---

> **volatile** is a type qualifier that you can use to declare that an **object** can be modified in the program by the ***hardware***.

注意 volatile 和 多线程/多进程 没有关系。**该上锁还是要上锁** (互斥锁、自旋锁)。

硬件一般是因为 **memory-mapped hardware device** 。

我们需要用内存地址去访问设备，内存映射到硬件上，所以内存地址的映射内容**跟硬件状态有关**， 跟程序本身无关。

编译器有时自作聪明，认为内存地址的内容不会变， 就直接优化了。但这样其实不行。

出了硬件，还有**操作系统** ， 比 **system lock** , **信号量**,  

这样 内存中的**对象内容可能被操作系统修改** (并不在运行的程序内修改)。 

可以看  **SEI CERT C Coding Standard**

**[DCL22-C. Use volatile for data that cannot be cached](https://wiki.sei.cmu.edu/confluence/display/c/DCL22-C.+Use+volatile+for+data+that+cannot+be+cached)**

里面举了 LED 的例子。

---

总结起来， 就是**硬件**、**操作系统 **可能改变某个**对象/内存地址里的内容**， 

但**硬件**、**操作系统** 的行为是在当前程序的控制范围之外的。

**[DCL22-C. Use volatile for data that cannot be cached](https://wiki.sei.cmu.edu/confluence/display/c/DCL22-C.+Use+volatile+for+data+that+cannot+be+cached)**

[Microsoft volatile (C++)](https://docs.microsoft.com/en-us/cpp/cpp/volatile-cpp?view=msvc-160)

**[6.6 const 和 volatile](https://docs.oracle.com/cd/E19205-01/820-1210/bjakl/index.html)**

- `volatile` 不能解决多线程中的问题。

- 按照 [Hans Boehm & Nick Maclaren 的总结](http://web.archive.org/web/20180120044239/http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2006/n2016.html)，`volatile` 只在三种场合下是合适的。

- - 为**内存映射 I/O 端口**的对象
  - **异步信号处理(Asynchronous signal handling)**程序修改的对象
  - 调用 `setjmp` 的函数中声明的自动存储持续时间对象，其值在 `setjmp` 调用和相应的 `longjmp` 调用之间会更改

---

C++服务编译耗时优化原理及实践 

<https://tech.meituan.com/2020/12/10/apache-kylin-practice-in-meituan.html>



