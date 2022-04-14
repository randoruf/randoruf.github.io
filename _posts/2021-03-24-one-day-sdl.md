---
layout: post
title: "游戏开发入门：一天学会 SDL"
date: 2021-03-24T00:20:0Z
tags: [cpp]
---

* TOC
{:toc}



## SDL 基础

- [Intro to SDL - Google Slides](https://docs.google.com/presentation/d/15MtBrLfLpwN3rBCb2xR0PxdbbFY_4PakVZQBjKNUWVM/edit#slide=id.g2c01ef4af_044)   - 备份 <http://randoruf.github.io/shared/pdf/docs/Intro_to_SDL.pdf>
- [SDL入门_慕课手记 (imooc.com)](https://www.imooc.com/article/25190) [李超_慕课网精英讲师 (imooc.com)](https://www.imooc.com/t/4873493)
- [Lazy Foo' Productions - Beginning Game Programming v2.0](https://lazyfoo.net/tutorials/SDL/index.php)

---

以我的理解， SDL 是软件和硬件之间的 Bridging ，主要用在多媒体处理。能够通过 API 直接调用硬件。

所以十分适合 User Interface 的开发。但很多人会选择用来做游戏（实际上用来做应用程序也没问题）。

<img src="/shared/imgs/image-20210325001037438.png" alt="image-20210325001135099" style="zoom:50%;" />

一个 SDL 游戏的基本流程

<img src="/shared/imgs/image-20210325001135099.png" alt="image-20210325001135099" style="zoom:50%;" />

### 安装 SDL 2

[安装 SDL2 (Setup SDL2 with VS2019 and vcpkg) (ran.moe)](https://ran.moe/2021/03/23/install-sdl2-windows.html)



### Bit Flags 

写过 Linux 开发的人都会这个 。 就是比如  `0001 | 0010`  可以得到 `0011`  即代表最后两个操作都做。

当然实际情况不一定这样， 但原理相同。 



### 窗口

可以有多个窗口， 每个窗口会有唯一的 **ID** 。窗口是交互的最基本单位。

`SDL_Window` is the struct that holds all info about the Window itself: size, position, full screen, borders etc.

- 初始化 SDL 
- 创建窗口
- 更新窗口
- 删除窗口
- 退出 SDL



### 如何更新窗口 ( Surface and Texture)

- [c++ - What is an SDL renderer? - Stack Overflow](https://stackoverflow.com/questions/21007329/what-is-an-sdl-renderer)
- [SDL中Window,Renderer,Texture,Surface之间的关系_ykee126的专栏-CSDN博客](https://blog.csdn.net/ykee126/article/details/106806611)
- [「SDL第五篇」彻底理解纹理（Texture）_慕课手记 (imooc.com)](https://www.imooc.com/article/25379)
- [Surfaces and Textures - Free Pascal meets SDL (freepascal-meets-sdl.net)](https://www.freepascal-meets-sdl.net/surfaces-and-textures/)

SDL_Render 是渲染器，它也是主存中的一个对象。对Render操作时实际上分为两个阶段：

一、**渲染阶段**。在该阶段，用户可以画各种图形渲染到SDL_Surface或SDL_Texture 中;

二、**显示阶段**。参SDL_Texture为数据，通过OpenGL操作GPU，**最终将 SDL_Surfce 或SDL_Texture中的数据输出到显示器上**。



上面提及到的 SDL_Surface 和 SDL_Texture 本质上都是**一组像素信息** (A structure that contains an efficient, driver-specific representation of **pixel data**.)。

<img src="/shared/imgs/CreationOfTextureFlowDiagram-Plain.png" alt="img" style="zoom:50%;" />

注意 Surface 是过时的概念， 应该弃用 (但是字体还是需要 Surface )。

**Texture 主要有 width 、 height、 pixel format**  。你要明白，即使是几何图形也是由像素点组成的。如何创建 Texture 可以看下面。

由于 Texture 本质上就是**一区块像素点 (x, y, width, length)**， 所以 **SDL_Rect** 的概念就非常重要。



#### 通过 CPU 渲染 (Surface)

CPU渲染在初级教程随处可见，不讨论。说一下简单的过程。

- 获得图形/图片的 Surface,
- 获得 Window 的 Surface,
- 通过 `SDL_BlitSurface` 图形/图片复制到 Window 的 Surface 上
	- (也有一些函数可以直接在 Window 的 Surface 画几何图形) 

注意 Surface 是过时的概念， 应该弃用。



#### 通过 GPU 渲染 (**Renderer**)

[CategoryRender - SDL Wiki' (libsdl.org)](https://wiki.libsdl.org/CategoryRender)

实际上 Surface 和 Texture 都是一些像素的信息。但是 Texture 的功能更加强大，你可以做一些 rotation 等操作(The texture images can have an additional color tint or alpha modulation applied to them, and may also be stretched with linear interpolation, rotated or flipped/mirrored.)。

每个 Renderer 都被绑定了一个窗口，在对 Renderer 进行刷新时， 可以刷新窗口。**我们需要把 Texture 复制到 Renderer 上**来让窗口显示 Texture。

**你可以把 Texture 理解为图案， 而 Renderer 理解为画布**。你需要在画布上画图形。

有三种方式创建 Texture 

- 设定好 pixel format 和 texture access 后手动填充像素（例如生成几何图形）
	- Pixel Format 可以用 `SDL_GetWindowPixelFormat()` 获得，即使用 Window 默认的 Pixel Format。
	- [Texture Access](https://wiki.libsdl.org/SDL_TextureAccess)  有三个值 
		- SDL_TEXTUREACCESS_STATIC 几乎不改变
		- SDL_TEXTUREACCESS_STREAMING 经常变化（在读取时需要上互斥锁，不允许别的线程修改。例如我在看书别把书抢走）。
		- SDL_TEXTUREACCESS_TARGET 
	- 注意上面的 Pixel Format 和 Texture Access 也适用于下面直接读取图片的操作。
- 从 Surface 读取， 但是由于 Surface 不建议使用，这种方法也不建议
- 直接读取图片，很多游戏都是这么做的。建议直接用 `SDL2_image` , 因为 PNG 图像质量最高。



#### Texture Scaling and Movement 

很简单，  **`SDL_RenderCopy()`  要求 source_rect 和 dest_rect** 。 

你可以大概思考一下复制到 Screen/Render 的哪个位置 (**用 `SDL_Rect` 指定 x, y, w, h** ， 当然这种方法只能一块一块地画， 没有旋转)。

记得 SDL 的坐标系不是笛卡尔坐标系。



#### Texture Manipulation

系统默认是 SDL_TEXTUREACCESS_STATIC 类型。

但你可以在创建 Texture 的时候选择 SDL_TEXTUREACCESS_STREAMING （这种类型允许 Texture 上的像素被修改，所以叫 Manipulation) 

每次你要修改 Texture 的时候（例如从 Surface 复制 pixel 到 Texture 时， 你需要对 Texture 上锁， 禁止别的线程读取你还没修改完的东西，或者改变 Texture 的调色，叫 Color Key）。

- 给 Texture 上锁 `SDL_LockTexture()`  [Lazy Foo' Productions - Texture Manipulation](https://lazyfoo.net/tutorials/SDL/40_texture_manipulation/index.php)
- 给 Texture 解锁  `SDL_UnlockTexture()` 

注意 SDL 并没有 Matrix 的概念。是将一串 row 串起来 (希尔伯特曲线？[一种降维打击的可视化方案_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili](https://www.bilibili.com/video/av289538969/))。

这就涉及 pitch 这个概念：一个 Row 的 number of bytes. 这是为了在 memory copy 时更方便，例如 `pitch * height ` 就是整个 texture/surface 所占用的 bytes （还记得吗？内存的最小单位是 byte 呢！东大的招生题也是 8 bits 呢）

 关于 Texture Manipulation 的例子可以看这个 ： [Lazy Foo' Productions - Texture Manipulation](https://lazyfoo.net/tutorials/SDL/40_texture_manipulation/index.php) 。通过遍历 Texture 的每一个像素， 然后如果是白色就设为透明。



#### Texture Rotation and Flipping 

[Lazy Foo' Productions - Rotation and Flipping](https://lazyfoo.net/tutorials/SDL/15_rotation_and_flipping/index.php)

[How To Make A Game #17 : Multiple Animations & Render Flipping : in C++ And SDL2 Tutorial - YouTube](https://www.youtube.com/watch?v=xhof7x7FOq0)

如果你直接把图片读取成 Texture ， 可以用 [SDL_RenderCopyEx - SDL Wiki' (libsdl.org)](https://wiki.libsdl.org/SDL_RenderCopyEx) 做很多处理

- SDL_Rect 不说了
- angle 是旋转角度
- center 是旋转轴的 (x, y) [SDL_Point - SDL Wiki' (libsdl.org)](https://wiki.libsdl.org/SDL_Point)
- flip 是翻转图片 (水平转180°，垂直转180°， 还是不转？)



#### Texture Streaming 

[Lazy Foo' Productions - Texture Streaming](https://lazyfoo.net/tutorials/SDL/42_texture_streaming/index.php)

你可以很生猛地直接改变 Texture 的像素点（例如显示 Web Cam,  甚至是 Video），显然，要用 Buffer 。

要小心， **Texture 的 Pixel Format 必须要和 Streaming 流数据的 Pixel 相符**。

```cpp
//Copy frame from buffer
gStreamingTexture.lockTexture();
gStreamingTexture.copyPixels( gDataStream.getBuffer() );
gStreamingTexture.unlockTexture();
```

`gDataStream.getBuffer()`  是数据流。可以提供最上面的一帧。



#### Render to Texture 

[Lazy Foo' Productions - Render to Texture](https://lazyfoo.net/tutorials/SDL/43_render_to_texture/index.php)

 从字面的上的意思理解就是， 把图案画到 Texture ，而不是直接画到 Renderer 上。

 有很多函数比如 [SDL_RenderDrawRect - SDL Wiki' (libsdl.org)](https://wiki.libsdl.org/SDL_RenderDrawRect) 和 SDL gfx 的图形绘制函数 [SDL2_gfx: I:/Sources/sdl2gfx/SDL2_gfxPrimitives.h File Reference (ferzkopp.net)](https://www.ferzkopp.net/Software/SDL2_gfx/Docs/html/_s_d_l2__gfx_primitives_8h.html) 都只接受在 Renderer 上直接画图。

但实际上 `SDL_SetRenderTarget` 可以把 Texture 和 Renderer 绑定， 于是 Texture 就可以成为 Render 的 Render Target ， 也就是把图案画到 Render 上。

记得在创建 Texture 的时候要选择 `SDL_TEXTUREACCESS_TARGET` , 其中 width 和 height 代表 Texture 的dimension（单位是 Pixel) 。

```cpp

// create texture as the render target (so we don't want to draw on the renderer)....
SDL_Texture* mTexture = SDL_CreateTexture( gRenderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, width, height );

// render targer to mTexture 
SDL_SetRenderTarget( gRenderer, mTexture );

// draw/render rectangle to the render target/texture
SDL_Rect fillRect = { SCREEN_WIDTH / 4, SCREEN_HEIGHT / 4, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 };
SDL_SetRenderDrawColor( gRenderer, 0xFF, 0x00, 0x00, 0xFF );        
SDL_RenderFillRect( gRenderer, &fillRect );

//Reset render target(一定要在 RenderCopy 前把 Render Targert 设置为 Renderer, 否则只会复制到 Texture 上， 因为此时 render target 依旧为 Texture...)。
SDL_SetRenderTarget( gRenderer, NULL );

// copy the texture to the renderer 
SDL_Rect srcrect =  { x, y, mWidth, mHeight }; 
SDL_Rect renderQuad = { x, y, mWidth, mHeight };
double angle; 
SDL_Point* center;
SDL_RendererFlip flip;  //  https://wiki.libsdl.org/SDL_RendererFlip
SDL_RenderCopyEx( gRenderer, mTexture, &srcrect, &dstrect, angle, center, flip);
 
//Update screen
SDL_RenderPresent( gRenderer );
```

 详情可以看 [Render to Texture](/shared/pdf/docs/render_to_texture.pdf)





### 字体

字体最常用的是 True Type Font 格式。**字体实际上也可以由像素组成**(由 `SDL_ttf` 绘制成 Surface )。因为是 Surface ， 你有两种方法画到屏幕

- 通过 Texture 和 Renderer 
- 直接 Copy/Blit 到屏幕上 (Surface 特有)

<img src="/shared/imgs/sdl2_diagram1.png" alt="image-20210325001135099" style="zoom:50%;" />

当然还有一种方法就是割图片的区块作为字体：[Lazy Foo' Productions - Bitmap Fonts](https://lazyfoo.net/tutorials/SDL/41_bitmap_fonts/index.php)







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



---

## SDL 高级主题

### SDL Alpha Blending  

SDL 的文档写的比较抽象，注意到 `SDL_RenderCopy()` 会用到 Blending 。而 `SDL_RenderCopy()` 有 `src` 和 `dst` 。

再看看 [SDL_BlendMode - SDL Wiki' (libsdl.org)](https://wiki.libsdl.org/SDL_BlendMode) 的 src 和 dst 是不是觉得很熟悉了？要记住 `SDL_Renderer`  有时候的 render target 也是 Texture （也就是把 Texture 复制到 Texture ， 例如把车胎的 Texture 复制到 车辆的 Texture , 用 `SDL_SetRenderTarget` 即可。 

- SDL_BLENDMODE_NONE : 没有透明度。两个 Texture 颜色会直接覆盖。
- SDL_BLENDMODE_BLEND : 混色
- SDL_BLENDMODE_ADD : 
- SDL_BLENDMODE_MOD :   



#### 例子1： 夜晚光照效果

[Is possible to create ambient light in SDL2? - Game Development - Simple Directmedia Layer (libsdl.org)](https://discourse.libsdl.org/t/is-possible-to-create-ambient-light-in-sdl2/28381)

**把光照渲染到阴影上，最后展示整个阴影**。

- 光照是一个Texture (是 PNG 文件， 自带透明度) , 且 blending 模式为 `SDL_BLENDMODE_ADD`. 
- 阴影也是 Texture , 可以设置为 `(0, 0, 0, 255)` 意味黑色，最后的透明度无所谓。阴影的 blending 模式为 `SDL_BLENDMODE_MOD`

