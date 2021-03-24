---
layout: post
title: "游戏开发入门：一天学会 SDL"
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

- [c++ - What is an SDL renderer? - Stack Overflow](https://stackoverflow.com/questions/21007329/what-is-an-sdl-renderer)

- [SDL中Window,Renderer,Texture,Surface之间的关系_ykee126的专栏-CSDN博客](https://blog.csdn.net/ykee126/article/details/106806611)

- [「SDL第五篇」彻底理解纹理（Texture）_慕课手记 (imooc.com)](https://www.imooc.com/article/25379)

SDL_Render 是渲染器，它也是主存中的一个对象。对Render操作时实际上分为两个阶段：

一、**渲染阶段**。在该阶段，用户可以画各种图形渲染到SDL_Surface或SDL_Texture 中;

二、**显示阶段**。参SDL_Texture为数据，通过OpenGL操作GPU，**最终将 SDL_Surfce 或SDL_Texture中的数据输出到显示器上**。



#### 使用SDL_Texture

SDL提供了非常好用的操作SDL_Texture的方法，下面我们来重点介绍一下使用SDL_Texute的基本步骤。

- 创建一个 SDL_Texture。
- 渲染 Texture
- Destory Texture



#### 通过 CPU 渲染 (Surface)

CPU渲染在初级教程随处可见，不讨论。说一下简单的过程。

- 获得图形/图片的 Surface,
- 获得 Window 的 Surface,
- 通过 `SDL_BlitSurface` 图形/图片复制到 Window 的 Surface 上
	- (也有一些函数可以直接在 Window 的 Surface 画几何图形) 



#### 通过 GPU 渲染 (**Renderer**)

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

这里说一下大多数教程都没有提及的事件处理要点，这里主要参考[「SDL第四篇」事件处理_慕课手记 (imooc.com)](https://www.imooc.com/article/25270) 。

学过计算机结构的人都知道 Interrupting 比 Polling 更加节约 CPU 资源。

在 SDL 你有两种方法可以避免 CPU 使用率100% 来处理事件。

- Polling + SDL_Delay  : 这是最简单的方法， 在结尾可以加 `SDL_Delay(1000/60)` 代表刷新率 60 Hz 。当然你也可以用 Timer 算一下实际计算需要的时间， 然后在 Delay 减去处理时间，来达到同步(类似 ROS 系统)
- SDL_WaitEvent : 这是典型的 Interrupt 。在有新的命令前什么都不做。虽然这种方法更优， 但实际上很少用，因为游戏通常是交互的，即使没有外部事件也需要继续运行/渲染，阻塞性的事件等待是不可行的。

**自定义事件** 实际上也有用处。比如**按下某个按钮开始游戏**。在按下前是 WaitEvent() 什么都不做。按下后会有自定义事件插入到事件队列中，这样自己的程序也能使用 Interrupt 了。



### 多线程

[「SDL第六篇」孙悟空与多线程_慕课手记 (imooc.com)](https://www.imooc.com/article/25652)

学过操作系统的人都应该了解**多线程**需要**同步** ， 这样可以避免 Race Condition。 所以就不多说了。

***同步技巧有 Semaphore 、 互斥锁(Mutex)、 Wait*** 。(Mutex 和 Semaphore 有些许不同哦，比如应该由谁来解锁。现实中 Mutex 更常用)。

**写过 `fork()` 进程的朋友应该都知道 Wait 可以保证事件的执行顺序**，这个概念可以套用任何系统上(比如 FPGA)

比如一定要先下载网页，再打开浏览器（从系统的角度是这样的，要先缓存 DOM 才能浏览）。

常见的系统锁有 ([通俗易懂 悲观锁、乐观锁、可重入锁、自旋锁、偏向锁、轻量/重量级锁、读写锁、各种锁及其Java实现！ - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/71156910))

- **读写锁**: 分为**读锁**与**写锁**。
	- 读锁：一个 counting 变量，但不限制访问，**在修改内容之前，必须让读锁为零** (没有线程在使用该资源)。
	- 写锁：实现方法就是 Binary 互斥锁， 一旦写入时， 就会变为零。

- **自旋锁**: 偿试着给访问资源加锁 ，如果此时被访问资源已经上锁了，那就一直不停的偿试，直到加锁成功为止。由于它会非常消耗CPU资源，所以一般只锁今资源非常短的情况下才能使用它。

- **可重入锁**: 允许同一个线程多次获取同一把锁。比如一个递归函数里有加锁操作，递归过程中这个锁会阻塞自己吗？如果不会，那么这个锁就是**可重入锁**（因为这个原因可重入锁也叫做**递归锁**）。

但主要 Dead Lock 的四条件，其中一个就是 **互斥**。 所以系统锁可能会导致死锁。

死锁例子：A 要看到 B 开始才开始， B也要A先开始。两个人都不肯让步。



#### SDL 多线程

我们知道图像渲染很费时间，但是 Double Buffer的  RenderCopy 实际上很快。

这种技巧也能用到 OpenGL 之类的计算机图形中，比如要写光追之类的，你可以用 Kd-Tree (Quadtree 也可以) 把空间分成多个子空间， 然后创建多个线程分别渲染子空间。最后统一由一个中央线程负责把子空间的 Texture 复制到 Render 中(需要保证互斥，中央线程一次只能跟其中一个线程通信)，这样就可以充分利用硬件资源渲染。

这种技巧也可以用在 碰撞检测上。 当然如果你用了 Kd-tree 就没必要了，因为不是 Linear Scanning 。

**另外， Collision Checking 由 Broad Phase 和 Narrow Phase 组成**， 这种思想十分重要，可以用在典型的扔鸡蛋面试题上 “每隔10层按顺序扔一个鸡蛋(10, 20, 30, ...)，如果碎了就可以把范围缩小到 10 内。” 

- SDL 创建线程

- SDL 等待线程 (保证事件执行顺序， 比如 Thread A -> Thread B.... ， 又比如上面的光追渲染例子，**中央线程需要等待所有子线程完成**才能退出)

- 创建互斥量 (Mutex) 

	- 必须获得 Mutex 才能访问资源（类似进了厕所后上锁， 其他人无法访问）
	- 加锁 (即 Mutex 减一, 一般都是 Binary Mutex 居多)
	- 解锁 (同一个线程才有资格解锁， 比如只有厕所里的人才能打开厕所门)

	

### 音频

[「SDL第七篇」PCM音频播放器的实现_慕课手记 (imooc.com)](https://www.imooc.com/article/25702)

声卡会通过回调函数索取音频数据。你不能控制声卡播放，你只能备好数据等待声卡来取。

你可以把数据准备到 Buffer 里， 声卡通过回调函数会读取 Buffer 里面的声音数据。如果 buffer 用完了，可以继续读取文件，直到文件尾。

这篇笔记写得很全。



### 视频

[「SDL第八篇」支持倍速与慢放的YUV视频播放器_慕课手记 (imooc.com)](https://www.imooc.com/article/25975)

你可能了，就是每个 frame 都刷新画面。写个 while 就足以。一般而言， 25帧足以。但计算机的刷新率一般是60Hz.

这里可以做两个线程， 一个负责渲染， 一个负责定时。

渲染的一直在 Buffer 渲染（见 `video_buf` ），然后到时间了就从 Buffer 取出一帧， RenderCopy 就完事了（自然一帧也是texture)。