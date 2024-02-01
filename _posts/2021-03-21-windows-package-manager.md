---
layout: post
title: "Windows Package Manager 包管理工具"
date: 2021-03-21T00:20:0Z
tags: [windows,cpp]
---





现在 Windows 也有类似 **brew** 和 **apt** 之类的包管理工具， 那就是 **choco**

[Chocolatey Software - Chocolatey - The package manager for Windows](https://chocolatey.org/)



如果你想安装 C++ 库也很方便。首先安装好 **vcpkg**, 把 vcpkg 加入到 system path 。然后让他连接 Visual Studio (先安装 Visual Studio).s

```bash
vcpkg integrate install
```

**vcpkg** (记得在**纯净的 powershell** 运行, 不要运行任何 x64 Native Build Tool Prompt 之类的 wrapper 命令行) 

以后想装什么新的 library , 可以直接 

```
vcpkg search <pkg_name>
```

例如我想装 sdl2 和 ompl 

有一项结果就是 

```
ompl                 1.5.0#1          The Open Motion Planning Library, consists of many state-of-the-art sampling-b...
ompl[app]                             Add support for reading meshes and performing collision checking
```

还有 sdl2 

```
sdl2                 2.0.12#5         Simple DirectMedia Layer is a cross-platform development library designed to p...
sdl2[vulkan]                          Vulkan functionality for SDL
sdl2-gfx             1.0.4-6          Graphics primitives (line, circle, rectangle etc.) with AA support, rotozoomer...
sdl2-image           2.0.5            SDL_image is an image file loading library. It loads images as SDL surfaces an...
sdl2-image[libjpeg-turbo]             Support for JPEG image format
sdl2-image[libwebp]                   Support for WEBP image format.
sdl2-image[tiff]                      Support for TIFF image format
sdl2-mixer           2.0.4#10         Multi-channel audio mixer library for SDL.
sdl2-mixer[dynamic-load]              Load plugins with dynamic call
sdl2-mixer[libflac]                   Support for FLAC audio format.
sdl2-mixer[libmodplug]                Support for MOD audio format.
sdl2-mixer[libvorbis]                 Support for OGG Vorbis audio format.
sdl2-mixer[mpg123]                    Support for MP3 audio format.
sdl2-mixer[nativemidi]                Support for MIDI audio format on Windows and macOS.
sdl2-mixer[opusfile]                  Support for Opus audio format.
sdl2-net             2.0.1-8          Networking library for SDL
sdl2-ttf             2.0.15-3         A library for rendering TrueType fonts with SDL
```

当然装你需要的就可以了。

- sdl2:x64-windows
- sdl2-gfx
- sdl2-image
- sdl2-mixer
- sdl2-net
- sdl2-ttf

[Setup SDL2 with VS2019 and vcpkg - DEV Community](https://dev.to/taowyoo/setup-sdl2-with-vs2019-and-vcpkg-32eg))

[Setup SDL2 with VS2019 and vcpkg - DEV Community](https://ran.moe/shared/pdf/docs/vcpkg-sdl2-installation.pdf)

![image-20210322173448403](/shared/imgs/image-20210322173448403.png)

这里可以选 x86 还是 x64 哦。