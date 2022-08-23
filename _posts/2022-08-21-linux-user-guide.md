---
layout: post
title: 'Linux 开发环境的配置'
date: 2022-08-21
tags: [re]
---

* TOC 
{:toc}

---

## VSCode 编辑器

### 关闭 CMake 插件

这个插件除了破坏掉你辛苦配置的 CMake 参数，没有任何卵用。




## 系统
### 关闭自动更新

用 Linux 的人都知道自己要干什么。我希望计算机在做任何事情之前都需要经过我的同意。

Windows 和 macOS 可以开自动更新，但 Linux 就不行。

```
sudo dpkg-reconfigure unattended-upgrades
sudo apt remove unattended-upgrades
```

如果不幸中招了，然后没耐性等完成，可以先关机，再修补。

```
sudo apt —-fix-broken install
```

