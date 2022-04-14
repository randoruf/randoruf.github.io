---
layout: post
title: "Command Line Startup Files (.zshenv, .zprofile, .zshrc, .zlogin, .zlogout)"
date: 2022-03-17
tags: [cs]
---

## 参考资料

- [An Introduction to the Z Shell - Startup Files (sourceforge.io)](https://zsh.sourceforge.io/Intro/intro_3.html)
- [zsh - What should/shouldn't go in .zshenv, .zshrc, .zlogin, .zprofile, .zlogout? - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/71253/what-should-shouldnt-go-in-zshenv-zshrc-zlogin-zprofile-zlogout)

大概知道启动顺序就可以了。

```
$ZDOTDIR/.zshenv
$ZDOTDIR/.zprofile
$ZDOTDIR/.zshrc
$ZDOTDIR/.zlogin
$ZDOTDIR/.zlogout
```

一般建议修改 `.zshrc` ，不然不记得都在那里改过。

macOS 的 System Environment 每次登出都会清空的。

苹果 Xcode 比较坑的地方是，每次更新都会删掉原来的 Command Line Tools 

所以在设置 `SDKROOT` 的时候，就很麻烦，每次更新都要搞一次。

