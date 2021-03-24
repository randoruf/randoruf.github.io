---
layout: post
title: "一天学会 SDL"
date: 2021-03-24T00:20:0Z
---



## 主要参考资料

- [SDL入门_慕课手记 (imooc.com)](https://www.imooc.com/article/25190) [李超_慕课网精英讲师 (imooc.com)](https://www.imooc.com/t/4873493)
- [Lazy Foo' Productions - Beginning Game Programming v2.0](https://lazyfoo.net/tutorials/SDL/index.php)

---

以我的理解， SDL 是软件和硬件之间的 Bridging ，主要用在多媒体处理。能够通过 API 直接调用硬件。

所以十分适合 User Interface 的开发。但很多人会选择用来做游戏（实际上用来做应用程序也没问题）。



### 窗口

可以有多个窗口， 每个窗口会有唯一的 **ID** 。窗口是交互的最基本单位。

`SDL_Window` is the struct that holds all info about the Window itself: size, position, full screen, borders etc.

- 初始化 SDL 
- 创建窗口
- 更新窗口
- 删除窗口
- 退出 SDL



### 如何更新窗口

[c++ - What is an SDL renderer? - Stack Overflow](https://stackoverflow.com/questions/21007329/what-is-an-sdl-renderer)

[SDL中Window,Renderer,Texture,Surface之间的关系_ykee126的专栏-CSDN博客](https://blog.csdn.net/ykee126/article/details/106806611)



##### 通过 CPU 渲染 (Surface)

CPU渲染在初级教程随处可见，不讨论。说一下简单的过程。

- 获得图形/图片的 Surface,
- 获得 Window 的 Surface,
- 通过 `SDL_BlitSurface` 图形/图片复制到 Window 的 Surface 上
	- (也有一些函数可以直接在 Window 的 Surface 画几何图形) 



##### 通过 GPU 渲染 (**Renderer**)

这种方法更加常用，因为可以使用硬件加速。

每个 Renderer 都被绑定了一个窗口，在对 Renderer 进行刷新时， 可以刷新窗口。

Texture 可以理解为 GPU 中的 Surface 。**而我们需要把 Texture 复制到 Renderer 上**。

**你可以把 Texture 理解为图案， 而 Renderer 理解为画布**。你需要在画布上画图形。

而且 Texture 的功能更加强大，你可以做一些转换操作。实际上 Surface 和 Texture 都是一些像素的信息。



### 基本图形

你要明白 SDL 能够绘制基本的 geometric primitives ， 也就是点、线、矩形。

实际上这是故意的， 因为你可以通过组合画出更加复杂的图形 (例如多边形就是多条直线的组合）。

你可以同时画**多个点**，**多条线**，甚至**多块矩形**。



### 事件处理

- `SDL_PollEvent()` ，获得事件队列中头部第一个事件（事件队列有时候为空）
- `SDL_WaitEvent()` 就是阻塞性地等待下一个事件（可以节约 cpu)， 比如等待用户按某个按键才会进行下一步，否则什么都不做。
- `SDL_WaitEventTimeout()` 有最大等待时间。
- `SDL_PeekEvent()` 提取事件出来看看， 可能会移走事件(看官方文档)
- `SDL_PushEvent()` 你可以人为模拟事件， 添加到事件序列。当然你也可以自定义一种事件。







