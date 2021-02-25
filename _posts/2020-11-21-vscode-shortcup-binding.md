---
layout: post
title: "Visual Studio Code shortcut binding - if your extentsion does not work"
date: 2020-11-21T00:20:00Z
---



如果你发现 Visual Studio Code 刚刚安装的插件不能正常工作， **不要慌张！**

这是因为多个插件都会在安装时对 VS Code 的 Keyboard Shortcut Binding 修改！



比如我就试过安装 `markdown-preview-enhanced` 后竟然无法用 `Shift + Command + V` 预览 Markdown 文件（跳出来还是 Visual Studio Code 极丑的原生 Markdown preview）。

找到 Visual Studio Code 的官方网站 <https://code.visualstudio.com/docs/getstarted/keybindings>



**File** > **Preferences** > **Keyboard Shortcuts**. (**Code** > **Preferences** > **Keyboard Shortcuts** on macOS) 

然后把其他垃圾的映射全部删除。

